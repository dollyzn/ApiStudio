import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  try {
    if (!env.N8N_WEBHOOK_URL) {
      return NextResponse.json(
        { error: "N8N webhook URL not configured" },
        { status: 500 }
      );
    }

    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token é obrigatório" },
        { status: 400 }
      );
    }

    const { data } = await axios.post(
      env.N8N_WEBHOOK_URL,
      {
        action: "validateToken",
        token,
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 5000,
      }
    );

    if (!data?.valid) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true }, { status: 200 });
  } catch (error) {
    console.error("[API][AUTH VALIDATE]", error);

    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
