import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/lib/env";

interface ChatwootInbox {
  id: number;
  name: string;
}

interface N8nInboxResponse {
  data?: ChatwootInbox[];
}

export async function GET(request: NextRequest) {
  try {
    if (!env.N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N webhook URL not configured" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization")?.replace(/"/g, "");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const { data } = await axios.get<N8nInboxResponse>(
      `${env.N8N_WEBHOOK_URL}/inboxes/list`,
      {
        headers: {
          "x-api-key": authHeader,
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
