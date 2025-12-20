"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Phone, Key, Lock, CheckCircle, XCircle, Inbox } from "lucide-react"

interface MessageInbox {
  id: number
  name: string
}

interface FormData {
  phone: string
  inboxId: string
  codigo: string
  senha: string
}

interface StatusMessage {
  type: "success" | "error"
  message: string
}

export default function MessageConfirmationForm() {
  const searchParams = useSearchParams()
  const [inboxes, setInboxes] = useState<MessageInbox[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState<StatusMessage | null>(null)
  const [formData, setFormData] = useState<FormData>(() => {
    const number = searchParams.get("number") || ""
    const body = searchParams.get("body") || ""
    const decodedBody = decodeURIComponent(body)
    const codigoMatch = decodedBody.match(/\*Código\*[:\s]*([^\s\n]+)/i)
    const senhaMatch = decodedBody.match(/\*Senha\*[:\s]*([^\s\n]+)/i)

    return {
      phone: number,
      inboxId: "",
      codigo: codigoMatch ? codigoMatch[1] : "",
      senha: senhaMatch ? senhaMatch[1] : "",
    }
  })

  useEffect(() => {
    const fetchInboxes = async () => {
      try {
        const response = await fetch("/api/inboxes")
        if (!response.ok) throw new Error("Failed to fetch inboxes")
        const data = await response.json()
        setInboxes(data)
      } catch (error) {
        console.error("Error fetching inboxes:", error)
        setStatus({ type: "error", message: "Erro ao carregar caixas de entrada" })
      } finally {
        setLoading(false)
      }
    }

    fetchInboxes()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.phone || !formData.inboxId || !formData.codigo || !formData.senha) {
      setStatus({ type: "error", message: "Por favor, preencha todos os campos" })
      return
    }

    setSending(true)
    setStatus(null)

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: formData.phone,
          inboxId: Number.parseInt(formData.inboxId),
          codigo: formData.codigo,
          senha: formData.senha,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao enviar mensagem")
      }

      setStatus({ type: "success", message: "Mensagem enviada com sucesso!" })

      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData((prev) => ({
          ...prev,
          inboxId: "",
          codigo: "",
          senha: "",
        }))
        setStatus(null)
      }, 3000)
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Erro ao enviar mensagem",
      })
    } finally {
      setSending(false)
    }
  }

  const handleCancel = () => {
    setFormData((prev) => ({
      ...prev,
      inboxId: "",
      codigo: "",
      senha: "",
    }))
    setStatus(null)
  }

  const isFormValid = formData.phone && formData.inboxId && formData.codigo && formData.senha

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold">Confirmação de envio de acesso ao exame</CardTitle>
          <CardDescription>Revise e confirme os dados antes de enviar</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Carregando caixas de entrada...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Número de telefone
                </Label>
                <Input id="phone" value={formData.phone} readOnly className="bg-muted/50 font-mono" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inbox" className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  Selecione a caixa de entrada
                </Label>
                <Select
                  value={formData.inboxId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, inboxId: value }))}
                >
                  <SelectTrigger id="inbox">
                    <SelectValue placeholder="Escolha uma caixa de entrada" />
                  </SelectTrigger>
                  <SelectContent>
                    {inboxes.map((inbox) => (
                      <SelectItem key={inbox.id} value={inbox.id.toString()}>
                        {inbox.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="codigo" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Código
                  </Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => setFormData((prev) => ({ ...prev, codigo: e.target.value }))}
                    className="font-mono"
                    placeholder="Digite o código"
                  />
                </div>

                {/* Senha */}
                <div className="space-y-2">
                  <Label htmlFor="senha" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Senha
                  </Label>
                  <Input
                    id="senha"
                    value={formData.senha}
                    onChange={(e) => setFormData((prev) => ({ ...prev, senha: e.target.value }))}
                    className="font-mono"
                    placeholder="Digite a senha"
                  />
                </div>
              </div>

              {status && (
                <Alert
                  className={
                    status.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                      : "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                  }
                >
                  {status.type === "success" ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  )}
                  <AlertDescription
                    className={
                      status.type === "success"
                        ? "text-emerald-800 dark:text-emerald-200"
                        : "text-red-800 dark:text-red-200"
                    }
                  >
                    {status.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={!isFormValid || sending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
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
                  onClick={handleCancel}
                  disabled={sending}
                  className="flex-1 bg-transparent"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
