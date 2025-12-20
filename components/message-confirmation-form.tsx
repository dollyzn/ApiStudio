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
import { Loader2, Phone, Inbox, Key, Lock } from "lucide-react";

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

export default function MessageConfirmationForm() {
  const searchParams = useSearchParams();
  const [inboxes, setInboxes] = useState<MessageInbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const initialValues = useMemo(() => {
    const number = searchParams.get("number") || "";
    const body = searchParams.get("body") || "";
    const decodedBody = decodeURIComponent(body);

    const codigoMatch = decodedBody.match(/\*Código\*[:\s]*([^\s\n]+)/i);
    const senhaMatch = decodedBody.match(/\*Senha\*[:\s]*([^\s\n]+)/i);

    return {
      phone: number,
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
        const res = await fetch("/api/inboxes");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setInboxes(data);
      } catch {
        toast.error("Erro ao carregar caixas de entrada");
      } finally {
        setLoading(false);
      }
    };

    fetchInboxes();
  }, []);

  const onSubmit = async (values: FormValues) => {
    setSending(true);

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: values.phone,
          inboxId: Number(values.inboxId),
          codigo: values.codigo,
          senha: values.senha,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result?.error || "Erro ao enviar mensagem");
      }

      toast.success("Mensagem enviada com sucesso");
      form.reset({ ...initialValues, inboxId: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao enviar mensagem"
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Confirmação de envio de acesso ao exame</CardTitle>
          <CardDescription>
            Revise os dados antes de confirmar o envio
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin mr-2 text-primary" />
              <span className="text-muted-foreground">
                Carregando caixas de entrada...
              </span>
            </div>
          ) : (
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
                      <FormControl>
                        <Input {...field} readOnly className="font-mono" />
                      </FormControl>
                    </FormItem>
                  )}
                />

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
                          <Input {...field} className="font-mono" />
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
                          <Input {...field} className="font-mono" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button type="submit" disabled={sending} className="flex-1">
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
                    onClick={() => form.reset(initialValues)}
                    disabled={sending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
