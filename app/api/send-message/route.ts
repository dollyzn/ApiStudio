import { type NextRequest, NextResponse } from "next/server"

interface SendMessagePayload {
  phone: string
  inboxId: number
  codigo: string
  senha: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMessagePayload = await request.json()

    // Validate payload
    if (!body.phone || !body.inboxId || !body.codigo || !body.senha) {
      return NextResponse.json({ error: "Dados incompletos. Todos os campos são obrigatórios." }, { status: 400 })
    }

    // Validate phone number format
    if (!/^\d+$/.test(body.phone)) {
      return NextResponse.json({ error: "Número de telefone inválido" }, { status: 400 })
    }

    const chatwootUrl = process.env.CHATWOOT_URL
    const chatwootToken = process.env.CHATWOOT_API_TOKEN
    const accountId = process.env.CHATWOOT_ACCOUNT_ID

    // Prepare message content
    const messageContent = `Olá! Aqui estão os dados de acesso ao seu exame:

📋 *Código:* ${body.codigo}
🔑 *Senha:* ${body.senha}

Acesse: http://www.ceroimagem.com.br

Se tiver dúvidas, estamos à disposição!`

    // If Chatwoot credentials are not provided, log and return success (development mode)
    if (!chatwootUrl || !chatwootToken || !accountId) {
      console.log("[v0] Chatwoot not configured - Message would be sent:")
      console.log({
        phone: body.phone,
        inboxId: body.inboxId,
        message: messageContent,
      })

      return NextResponse.json({
        success: true,
        message: "Mensagem enviada com sucesso (modo desenvolvimento)",
        data: {
          phone: body.phone,
          inboxId: body.inboxId,
        },
      })
    }

    // Send message to Chatwoot
    // First, find or create conversation
    const conversationResponse = await fetch(`${chatwootUrl}/api/v1/accounts/${accountId}/conversations`, {
      method: "POST",
      headers: {
        api_access_token: chatwootToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inbox_id: body.inboxId,
        contact_id: body.phone, // This may need adjustment based on Chatwoot's contact management
        source_id: body.phone,
      }),
    })

    if (!conversationResponse.ok) {
      const errorData = await conversationResponse.text()
      console.error("[v0] Chatwoot conversation error:", errorData)
      throw new Error("Erro ao criar conversa no Chatwoot")
    }

    const conversation = await conversationResponse.json()
    const conversationId = conversation.id

    // Send message to conversation
    const messageResponse = await fetch(
      `${chatwootUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          api_access_token: chatwootToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: messageContent,
          message_type: "outgoing",
          private: false,
        }),
      },
    )

    if (!messageResponse.ok) {
      const errorData = await messageResponse.text()
      console.error("[v0] Chatwoot message error:", errorData)
      throw new Error("Erro ao enviar mensagem no Chatwoot")
    }

    const messageResult = await messageResponse.json()

    return NextResponse.json({
      success: true,
      message: "Mensagem enviada com sucesso",
      data: {
        conversationId,
        messageId: messageResult.id,
        phone: body.phone,
        inboxId: body.inboxId,
      },
    })
  } catch (error) {
    console.error("[v0] Error in send-message route:", error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao enviar mensagem",
        success: false,
      },
      { status: 500 },
    )
  }
}
