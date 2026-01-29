/**
 * API Route: POST /api/print/sign
 *
 * Endpoint para assinar requisições do QZ Tray
 * A private key deve ser mantida segura no backend (variável de ambiente)
 *
 * @module app/api/print/sign/route
 */

import { NextRequest, NextResponse } from "next/server";
import { createSign } from "crypto";
import { env } from "@/lib/env";

/**
 * Assina uma string com a private key RSA
 *
 * @param request String a ser assinada (enviada pelo QZ Tray)
 * @param privateKey Private key em formato PEM
 * @returns Assinatura em base64
 */
function signRequest(request: string, privateKey: string): string {
  const sign = createSign("SHA1");
  sign.update(request);
  sign.end();

  const signature = sign.sign(privateKey, "base64");
  return signature;
}

/**
 * POST /api/print/sign
 *
 * Recebe uma requisição do QZ Tray e retorna a assinatura
 */
export async function POST(request: NextRequest) {
  try {
    const { request: toSign } = await request.json();

    if (!toSign || typeof toSign !== "string") {
      return NextResponse.json(
        { error: "Campo 'request' é obrigatório e deve ser uma string" },
        { status: 400 },
      );
    }

    // Verificar se a private key está configurada
    if (!env.QZ_PRIVATE_KEY) {
      return NextResponse.json(
        { error: "Chave de assinatura não configurada no servidor" },
        { status: 500 },
      );
    }

    // Decodificar a private key (base64 -> PEM)
    const privateKeyPem = Buffer.from(env.QZ_PRIVATE_KEY, "base64").toString(
      "utf-8",
    );

    // Assinar a requisição
    const signature = signRequest(toSign, privateKeyPem);

    return NextResponse.json({ signature }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao assinar requisição" },
      { status: 500 },
    );
  }
}
