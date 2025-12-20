import { NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/lib/env";

interface ChatwootInbox {
  id: number;
  name: string;
}

interface N8nInboxResponse {
  data?: ChatwootInbox[];
}

export async function GET() {
  try {
    if (!env.N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N webhook URL not configured" },
        { status: 500 }
      );
    }

    const { data } = await axios.post<N8nInboxResponse>(
      env.N8N_WEBHOOK_URL,
      {
        action: "getInboxes",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const rawInboxes = data.data;

    if (!Array.isArray(rawInboxes)) {
      return NextResponse.json(
        { error: "Invalid inbox response format" },
        { status: 502 }
      );
    }

    const inboxes: ChatwootInbox[] = rawInboxes.map((inbox) => ({
      id: inbox.id,
      name: inbox.name,
    }));

    return NextResponse.json(inboxes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch inboxes",
      },
      { status: 500 }
    );
  }
}
