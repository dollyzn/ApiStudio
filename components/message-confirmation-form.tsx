"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Phone,
  Key,
  Lock,
  User,
  Send,
  UserCheck,
  Inbox,
} from "lucide-react";
import { MessageConfirmationSkeleton } from "./message-confirmation-skeleton";
import { api } from "@/lib/api";
import { Icons } from "./ui/icons";
import { PhoneInput } from "./ui/phone-input";
import { parsePhoneNumber } from "react-phone-number-input";
import { AxiosError } from "axios";
import Checkmark from "./ui/checkmark";

interface MessageInbox {
  id: number;
  name: string;
}

const formSchema = z.object({
  phone: z.string().min(1),
  inboxId: z.string().min(1, "Selecione uma caixa de entrada"),
  codigo: z.string().min(1, "Informe o código"),
  senha: z.string().min(1, "Informe a senha"),
});

type FormValues = z.infer<typeof formSchema>;

type ContactValidationStatus =
  | "idle"
  | "validating"
  | "validated"
  | "not-found"
  | "error";

export default function MessageConfirmationForm() {
  const searchParams = useSearchParams();
  const [inboxes, setInboxes] = useState<MessageInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [contactStatus, setContactStatus] =
    useState<ContactValidationStatus>("idle");
  const [contactId, setContactId] = useState<number | null>(null);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [showOriginDialog, setShowOriginDialog] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [originInboxId, setOriginInboxId] = useState("");

  const initialValues = useMemo(() => {
    const number = searchParams.get("phone") || "";
    const body = searchParams.get("text") || "";
    const decodedBody = decodeURIComponent(body);

    const codigoMatch = decodedBody.match(/\*Código\*[:\s]*([^\s\n]+)/i);
    const senhaMatch = decodedBody.match(/\*Senha\*[:\s]*([^\s\n]+)/i);

    return {
      phone: parsePhoneNumber(number, "BR")?.number || number,
      inboxId: "",
      codigo: codigoMatch?.[1] ?? "",
      senha: senhaMatch?.[1] ?? "",
    };
  }, [searchParams]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    const fetchInboxes = async () => {
      try {
        const res = await api.get("/api/inboxes");
        if (!res.data) throw new Error();
        const data = res.data;
        setInboxes(data);
      } catch {
        toast.error("Erro ao carregar caixas de entrada");
      } finally {
        setLoading(false);
      }
    };

    fetchInboxes();
  }, []);

  useEffect(() => {
    // Reset contact validation when phone number changes
    setContactStatus("idle");
    setContactId(null);
    setOriginInboxId("");
    setNewContactName("");
  }, [form.watch("phone")]);

  useEffect(() => {
    if (contactStatus !== "not-found") {
      setShowOriginDialog(false);
      setOriginInboxId("");
      setNewContactName("");
    }
  }, [contactStatus]);

  const validateContact = async (phone: string) => {
    if (!phone) {
      toast.error("Informe o número de telefone");
      return;
    }

    setContactStatus("validating");
    setContactId(null);

    try {
      const res = await api.post("/api/contacts/validate", { phone });
      const data = res.data;

      if (data.success || data.contactId) {
        setContactId(data.contactId);
        setContactStatus("validated");
        toast.success("Contato encontrado!");
      } else {
        setContactStatus("not-found");
        toast.info(
          "Contato não encontrado. Informe o nome para criar um novo contato."
        );
      }
    } catch (error) {
      setContactStatus("error");
      toast.error("Erro ao validar contato");
    }
  };

  const createContact = async (
    phone: string,
    name: string,
    inboxOriginId: string
  ) => {
    if (!name.trim()) {
      toast.error("Informe o nome do contato");
      return;
    }

    if (!inboxOriginId) {
      toast.error("Selecione a origem do contato");
      return;
    }

    setIsCreatingContact(true);

    try {
      const res = await api.post("/api/contacts/create", {
        phone,
        name: name.trim(),
        inboxId: Number(inboxOriginId),
      });
      const data = res.data;

      if (data.success && data.contactId) {
        setContactId(data.contactId);
        setContactStatus("validated");
        setShowOriginDialog(false);
        setOriginInboxId("");
        setNewContactName("");
        toast.success("Contato criado com sucesso!");
      } else {
        throw new Error("Erro ao criar contato");
      }
    } catch (error) {
      toast.error("Erro ao criar contato");
    } finally {
      setIsCreatingContact(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    if (contactStatus !== "validated" || !contactId) {
      toast.error("Valide o contato antes de enviar a mensagem");
      return;
    }

    setSending(true);

    try {
      const res = await api.post("/api/send-message", {
        phone: values.phone,
        inboxId: Number(values.inboxId),
        codigo: values.codigo,
        senha: values.senha,
        contactId: contactId,
      });

      const result = await res.data;

      if (!result.success) {
        throw new Error(result?.error || "Erro ao enviar mensagem");
      }

      toast.success("Mensagem enviada com sucesso");
      setMessageSent(true);
    } catch (error) {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.error || "Erro ao enviar mensagem"
          : "Erro ao enviar mensagem"
      );
    } finally {
      setSending(false);
    }
  };

  const handleValidateContact = () => {
    const phone = form.getValues("phone");
    validateContact(phone);
  };

  const handleCreateContact = () => {
    const phone = form.getValues("phone");
    createContact(phone, newContactName, originInboxId);
  };

  const handleNewMessage = () => {
    setMessageSent(false);
    form.reset({ ...initialValues, inboxId: "" });
    setContactStatus("idle");
    setContactId(null);
    setOriginInboxId("");
    setNewContactName("");
  };

  if (messageSent) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="border-green-200 dark:border-green-900/50 bg-linear-to-br from-green-50/50 to-background dark:from-green-950/20 dark:to-background">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full animate-pulse" />
              <Checkmark size={100} strokeWidth={5} color="#007950" />
            </div>

            <div className="space-y-3 max-w-md">
              <h2 className="text-3xl font-bold text-green-700 dark:text-green-300">
                Mensagem enviada!
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                O código e a senha foram enviados com sucesso para o paciente.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                <Icons.WhatsApp className="size-4 fill-current" />
                <span>Você pode fechar esta aba agora</span>
              </div>

              <Button
                onClick={handleNewMessage}
                variant="outline"
                className="mt-2"
              >
                Enviar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {loading ? (
        <MessageConfirmationSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Confirmação de envio de acesso ao exame</CardTitle>
            <CardDescription>
              Revise os dados antes de confirmar o envio
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Número de telefone
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <PhoneInput
                              {...field}
                              className="w-full"
                              defaultCountry="BR"
                              placeholder="Informe o número de telefone"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={handleValidateContact}
                            disabled={
                              contactStatus === "validating" ||
                              contactStatus === "validated"
                            }
                            variant={
                              contactStatus === "validated"
                                ? "default"
                                : "outline"
                            }
                          >
                            {contactStatus === "validating" ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                Validando...
                              </>
                            ) : contactStatus === "validated" ? (
                              <>
                                <UserCheck className="size-4" />
                                Validado
                              </>
                            ) : (
                              "Validar"
                            )}
                          </Button>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Origem e nome em dialog - aparecem apenas quando contato não é encontrado */}
                  {contactStatus === "not-found" && (
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-input/30 px-2 rounded-md border h-9 w-full">
                        <Inbox className="h-4 w-4" />
                        Contato não encontrado.
                      </div>
                      <Dialog
                        open={showOriginDialog}
                        onOpenChange={setShowOriginDialog}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline">Criar</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Criar novo contato</DialogTitle>
                            <DialogDescription>
                              Selecione a caixa de entrada de onde este contato
                              chegou e dê um nome para salvá-lo.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-medium">
                                <Icons.WhatsApp className="size-4 fill-current" />
                                Caixa de origem do contato
                              </label>
                              <Select
                                value={originInboxId}
                                onValueChange={setOriginInboxId}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Escolha de onde veio este contato" />
                                </SelectTrigger>
                                <SelectContent>
                                  {inboxes.map((inbox) => (
                                    <SelectItem
                                      key={inbox.id}
                                      value={String(inbox.id)}
                                    >
                                      {inbox.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <label className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4" />
                                Nome do contato
                              </label>
                              <Input
                                value={newContactName}
                                onChange={(e) =>
                                  setNewContactName(e.target.value)
                                }
                                placeholder="Digite o nome do contato"
                                onKeyDown={(e) => {
                                  if (
                                    e.key === "Enter" &&
                                    originInboxId &&
                                    newContactName.trim()
                                  ) {
                                    e.preventDefault();
                                    handleCreateContact();
                                  }
                                }}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setShowOriginDialog(false)}
                            >
                              Cancelar
                            </Button>
                            <Button
                              type="button"
                              onClick={handleCreateContact}
                              disabled={
                                isCreatingContact ||
                                !originInboxId ||
                                !newContactName.trim()
                              }
                            >
                              {isCreatingContact ? (
                                <>
                                  <Loader2 className="size-4 animate-spin" />
                                  Criando...
                                </>
                              ) : (
                                "Criar contato"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Inbox */}
                  <FormField
                    control={form.control}
                    name="inboxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Icons.WhatsApp className="size-4 fill-current" />
                          Caixa de entrada
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={contactStatus !== "validated"}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione uma inbox" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {inboxes.map((inbox) => (
                              <SelectItem
                                key={inbox.id}
                                value={String(inbox.id)}
                              >
                                {inbox.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Código / Senha */}
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Key className="h-4 w-4" />
                          Código
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="font-mono"
                            disabled={contactStatus !== "validated"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Senha
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="font-mono"
                            disabled={contactStatus !== "validated"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={sending || contactStatus !== "validated"}
                    className="flex-1"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset(initialValues);
                      setContactStatus("idle");
                      setContactId(null);
                      setOriginInboxId("");
                      setNewContactName("");
                    }}
                    disabled={sending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
