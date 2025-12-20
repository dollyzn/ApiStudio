import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/lib/env";

interface SendMessagePayload {
  phone: string;
  inboxId: number;
  codigo: string;
  senha: string;
  raw?: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!env.N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N webhook URL not configured" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as SendMessagePayload;

    if (!body.phone || !body.inboxId || !body.codigo || !body.senha) {
      return NextResponse.json(
        { error: "Dados incompletos. Todos os campos são obrigatórios." },
        { status: 400 }
      );
    }

    if (!/^\d+$/.test(body.phone)) {
      return NextResponse.json(
        { error: "Número de telefone inválido." },
        { status: 400 }
      );
    }

    const payloadToN8n = {
      phone: body.phone,
      inboxId: body.inboxId,
      codigo: body.codigo,
      senha: body.senha,
      raw: body.raw ?? null,
      action: "sendMessage",
    };

    const { data } = await axios.post(env.N8N_WEBHOOK_URL, payloadToN8n, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      timeout: 5000,
    });

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao encaminhar dados para o n8n.",
      },
      { status: 500 }
    );
  }
}
