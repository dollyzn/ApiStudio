import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/lib/env";

interface ValidateContactResponse {
  match: boolean;
  contactId?: number;
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

    if (!body.phone) {
      return NextResponse.json(
        { error: "Phone é obrigatório" },
        { status: 400 }
      );
    }

    const { data } = await axios.post<ValidateContactResponse>(
      `${env.N8N_WEBHOOK_URL}/contacts/validate`,
      { phone: body.phone },
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
    console.error("[API][CONTACTS VALIDATE]", error);

    return NextResponse.json(
      {
        error: "Erro ao validar contato",
      },
      { status: 500 }
    );
  }
}
