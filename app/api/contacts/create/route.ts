import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/lib/env";

interface CreateContactResponse {
  contactId: number;
  success: boolean;
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    if (!body.phone || !body.name) {
      return NextResponse.json(
        { error: "Phone e name são obrigatórios" },
        { status: 400 }
      );
    }

    const { data } = await axios.post<CreateContactResponse>(
      `${env.N8N_WEBHOOK_URL}/contacts/create`,
      {
        phone: body.phone,
        name: body.name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": authHeader,
        },
        timeout: 10000,
      }
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[API][CONTACTS CREATE]", error);

    return NextResponse.json(
      {
        error: "Erro ao criar contato",
      },
      { status: 500 }
    );
  }
}
