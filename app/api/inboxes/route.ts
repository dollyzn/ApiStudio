import { NextResponse } from "next/server"

interface ChatwootInbox {
  id: number
  name: string
}

export async function GET() {
  try {
    const chatwootUrl = process.env.CHATWOOT_URL
    const chatwootToken = process.env.CHATWOOT_API_TOKEN
    const accountId = process.env.CHATWOOT_ACCOUNT_ID

    // If Chatwoot credentials are not provided, return mock data
    if (!chatwootUrl || !chatwootToken || !accountId) {
      console.log("[v0] Chatwoot credentials not configured, returning mock data")
      return NextResponse.json([
        { id: 1, name: "WhatsApp - Clínica Principal" },
        { id: 2, name: "WhatsApp - Atendimento 24h" },
        { id: 3, name: "WhatsApp - Resultados" },
      ])
    }

    // Fetch inboxes from Chatwoot API
    const response = await fetch(`${chatwootUrl}/api/v1/accounts/${accountId}/inboxes`, {
      headers: {
        api_access_token: chatwootToken,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Chatwoot API error: ${response.status}`)
    }

    const data = await response.json()

    // Map Chatwoot inboxes to our format
    const inboxes: ChatwootInbox[] = data.payload.map((inbox: any) => ({
      id: inbox.id,
      name: inbox.name,
    }))

    return NextResponse.json(inboxes)
  } catch (error) {
    console.error("[v0] Error fetching inboxes:", error)

    // Return mock data on error
    return NextResponse.json([
      { id: 1, name: "WhatsApp - Clínica Principal" },
      { id: 2, name: "WhatsApp - Atendimento 24h" },
      { id: 3, name: "WhatsApp - Resultados" },
    ])
  }
}
