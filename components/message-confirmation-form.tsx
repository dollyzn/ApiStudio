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
  Inbox,
  Key,
  Lock,
  User,
  CheckCircle2,
} from "lucide-react";
import { MessageConfirmationSkeleton } from "./message-confirmation-skeleton";
import { api } from "@/lib/api";

interface MessageInbox {
  id: number;
  name: string;
}

const formSchema = z.object({
  phone: z.string().min(1),
  name: z.string().optional(),
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
  const [contactStatus, setContactStatus] =
    useState<ContactValidationStatus>("idle");
  const [contactId, setContactId] = useState<number | null>(null);
  const [isCreatingContact, setIsCreatingContact] = useState(false);

  const initialValues = useMemo(() => {
    const number = searchParams.get("number") || "";
    const body = searchParams.get("body") || "";
    const decodedBody = decodeURIComponent(body);

    const codigoMatch = decodedBody.match(/\*Código\*[:\s]*([^\s\n]+)/i);
    const senhaMatch = decodedBody.match(/\*Senha\*[:\s]*([^\s\n]+)/i);

    return {
      phone: number,
      name: "",
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

      if (data.match || data.payload) {
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

  const createContact = async (phone: string, name: string) => {
    if (!name) {
      toast.error("Informe o nome do contato");
      return;
    }

    setIsCreatingContact(true);

    try {
      const res = await api.post("/api/contacts/create", { phone, name });
      const data = res.data;

      if (data.success && data.contactId) {
        setContactId(data.contactId);
        setContactStatus("validated");
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
      form.reset({ ...initialValues, inboxId: "" });
      setContactStatus("idle");
      setContactId(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar mensagem"
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
    const name = form.getValues("name");
    if (name) {
      createContact(phone, name);
    }
  };

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
                          <Input
                            {...field}
                            readOnly
                            className="font-mono flex-1"
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
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Validando...
                            </>
                          ) : contactStatus === "validated" ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
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

                {/* Name - só aparece quando contato não é encontrado */}
                {contactStatus === "not-found" && (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nome do contato
                        </FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Digite o nome do contato"
                              className="flex-1"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            onClick={handleCreateContact}
                            disabled={isCreatingContact || !field.value}
                          >
                            {isCreatingContact ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Criando...
                              </>
                            ) : (
                              "Criar"
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Inbox */}
                <FormField
                  control={form.control}
                  name="inboxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Inbox className="h-4 w-4" />
                        Caixa de entrada
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={contactStatus !== "validated"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma inbox" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {inboxes.map((inbox) => (
                            <SelectItem key={inbox.id} value={String(inbox.id)}>
                              {inbox.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Código / Senha */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      "Enviar mensagem"
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      form.reset(initialValues);
                      setContactStatus("idle");
                      setContactId(null);
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
