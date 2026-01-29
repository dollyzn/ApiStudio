/**
 * Cliente QZ Tray para comunicação com impressoras térmicas
 *
 * Este módulo gerencia a conexão com o QZ Tray, configuração de segurança
 * e comunicação com impressoras ESC/POS.
 *
 * @module lib/qz-tray
 */

"use client";

import * as qz from "qz-tray";
import { env } from "./env";
import type {
  PrinterInfo,
  PrintResult,
  QzConnectionStatus,
  PrintSenhaOptions,
} from "@/types/print";

/**
 * Status atual da conexão com QZ Tray
 */
let connectionStatus: QzConnectionStatus = "disconnected";

/**
 * Callbacks de mudança de status (para uso com React)
 */
const statusListeners = new Set<(status: QzConnectionStatus) => void>();

/**
 * Evita configuração repetida do security
 */
let securityConfigured = false;

/**
 * Evita corrida: múltiplas chamadas simultâneas de connect
 */
let connectPromise: Promise<void> | null = null;

/**
 * Atualiza o status da conexão e notifica listeners
 */
function updateStatus(status: QzConnectionStatus) {
  connectionStatus = status;
  statusListeners.forEach((listener) => listener(status));
}

/**
 * Registra listener para mudanças de status
 */
export function onStatusChange(callback: (status: QzConnectionStatus) => void) {
  statusListeners.add(callback);
  return () => statusListeners.delete(callback);
}

/**
 * Retorna o status atual da conexão
 */
export function getConnectionStatus(): QzConnectionStatus {
  return connectionStatus;
}

/**
 * Configura a segurança do QZ Tray
 *
 * Define o certificado público e o endpoint de assinatura.
 * A assinatura é feita no backend para manter a private key segura.
 */
async function setupSecurity(): Promise<void> {
  if (securityConfigured) return;

  const certificateUrl = env.NEXT_PUBLIC_QZ_CERTIFICATE_URL;
  const signatureEndpoint = env.NEXT_PUBLIC_QZ_SIGNATURE_ENDPOINT;

  if (!certificateUrl) {
    throw new Error("NEXT_PUBLIC_QZ_CERTIFICATE_URL não configurado");
  }
  if (!signatureEndpoint) {
    throw new Error("NEXT_PUBLIC_QZ_SIGNATURE_ENDPOINT não configurado");
  }

  qz.security.setCertificatePromise(async () => {
    const response = await fetch(certificateUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Falha ao carregar certificado (${response.status})`);
    }
    return await response.text();
  });

  qz.security.setSignaturePromise(async (toSign) => {
    const response = await fetch(signatureEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request: toSign }),
    });

    if (!response.ok) {
      throw new Error(`Falha ao assinar (${response.status})`);
    }

    const data = (await response.json()) as { signature?: string };

    if (!data?.signature) {
      throw new Error("Resposta de assinatura inválida (sem 'signature')");
    }

    return data.signature;
  });

  securityConfigured = true;
}

/**
 * Conecta ao QZ Tray
 *
 * @returns Promise que resolve quando conectado
 * @throws Error se não conseguir conectar
 */
export async function connectQzTray(): Promise<void> {
  if (connectionStatus === "connected" && qz.websocket.isActive()) return;
  if (connectPromise) return connectPromise;

  updateStatus("connecting");

  connectPromise = (async () => {
    try {
      await setupSecurity();

      // Se já está ativo, não reconecta
      if (!qz.websocket.isActive()) {
        await qz.websocket.connect();
      }

      updateStatus("connected");
      console.log("[QZ Tray] Conectado com sucesso");
    } catch (error) {
      updateStatus("error");
      throw new Error(
        "Não foi possível conectar ao QZ Tray. Verifique se o aplicativo está instalado e em execução.",
      );
    } finally {
      connectPromise = null;
    }
  })();

  return connectPromise;
}

/**
 * Desconecta do QZ Tray
 */
export async function disconnectQzTray(): Promise<void> {
  try {
    if (qz.websocket.isActive()) {
      await qz.websocket.disconnect();
    }
    updateStatus("disconnected");
    console.log("[QZ Tray] Desconectado");
  } catch {}
}

/**
 * Lista todas as impressoras disponíveis
 *
 * @returns Array de informações das impressoras
 */
export async function getPrinters(): Promise<PrinterInfo[]> {
  try {
    if (!qz.websocket.isActive()) {
      await connectQzTray();
    }

    const result = await qz.printers.find();
    const defaultPrinter = await qz.printers.getDefault();

    const printers: string[] = Array.isArray(result)
      ? result
      : typeof result === "string"
        ? [result]
        : [];

    return printers.map((name) => ({
      name,
      isDefault: Boolean(defaultPrinter && name === defaultPrinter),
    }));
  } catch (error) {
    throw new Error("Erro ao obter lista de impressoras");
  }
}

/**
 * Busca uma impressora específica por nome ou padrão
 *
 * @param query Nome da impressora ou padrão de busca
 * @returns Nome da impressora encontrada ou null
 */
export async function findPrinter(query?: string): Promise<string | null> {
  try {
    if (!qz.websocket.isActive()) {
      await connectQzTray();
    }

    if (!query) {
      const def = await qz.printers.getDefault();
      return def || null;
    }

    const result = await qz.printers.find(query);

    if (Array.isArray(result)) {
      return result[0] ?? null;
    }

    if (typeof result === "string") {
      return result || null;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Helpers ESC/POS
 */
function escInit() {
  return "\x1B\x40";
}
function escCenter(on: boolean) {
  return on ? "\x1B\x61\x01" : "\x1B\x61\x00";
}
function escBold(on: boolean) {
  return on ? "\x1B\x45\x01" : "\x1B\x45\x00";
}
/**
 * ESC ! n (modo fonte): 0x30 é bem compatível (2x width + 2x height).
 * Evita valores agressivos que algumas térmicas não suportam direito.
 */
function escFontMode(mode: number) {
  return `\x1B\x21${String.fromCharCode(mode)}`;
}
function gsCut(mode: "partial" | "full") {
  // Fallback mais compatível: partial (0x00)
  return mode === "full" ? "\x1D\x56\x41" : "\x1D\x56\x00";
}

/**
 * Gera comandos ESC/POS para impressão de senha
 *
 * @param options Opções de impressão
 * @returns Array de comandos ESC/POS
 */
function generateEscPosCommands(options: PrintSenhaOptions): string[] {
  const {
    codigo,
    senha,
    guiche,
    empresa = "CERO IMAGEM",
    paperWidth = 42, // 58mm
    cutMode = "partial",
  } = options;

  const now = new Date();
  const dataFormatada = now.toLocaleDateString("pt-BR");
  const horaFormatada = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const line = "=".repeat(Math.max(16, Math.min(64, paperWidth)));
  const subLine = "-".repeat(Math.max(16, Math.min(64, paperWidth)));

  const commands: string[] = [];

  // Init
  commands.push(escInit());

  // Header
  commands.push(escCenter(true));
  commands.push(escFontMode(0x30)); // 2x/2x
  commands.push(`${empresa}\n`);
  commands.push(escFontMode(0x00));

  commands.push(`${line}\n\n`);

  // Título
  commands.push(escCenter(true));
  commands.push(escBold(true));
  commands.push("SEU EXAME ESTA DISPONIVEL\n");
  commands.push(escBold(false));

  commands.push(`\n${subLine}\n\n`);

  // LOGIN
  commands.push(escCenter(true));
  commands.push("LOGIN\n");
  commands.push(escFontMode(0x30));
  commands.push(escBold(true));
  commands.push(`${codigo}\n`);
  commands.push(escBold(false));
  commands.push(escFontMode(0x00));

  commands.push("\n");

  // SENHA
  commands.push(escCenter(true));
  commands.push("SENHA\n");
  commands.push(escFontMode(0x30));
  commands.push(escBold(true));
  commands.push(`${senha}\n`);
  commands.push(escBold(false));
  commands.push(escFontMode(0x00));

  commands.push(`\n${subLine}\n\n`);

  // Orientação
  commands.push(escCenter(true));
  commands.push("ACESSE PELO\n");
  commands.push(escBold(true));
  commands.push("PORTAL DO PACIENTE\n");
  commands.push(escBold(false));
  commands.push("\n");
  commands.push("www.ceroimagem.com.br/paciente\n");

  commands.push(`\n${subLine}\n`);

  // Footer
  commands.push(escCenter(true));
  commands.push(`${dataFormatada} - ${horaFormatada}\n`);
  if (guiche) commands.push(`Guiche: ${guiche}\n`);

  commands.push("\n\n\n");

  // Cut
  commands.push(gsCut(cutMode));

  return commands;
}

/**
 * Imprime uma senha na impressora térmica
 *
 * @param options Opções de impressão da senha
 * @returns Resultado da impressão
 */
export async function printSenha(
  options: PrintSenhaOptions,
): Promise<PrintResult> {
  const { codigo, printer } = options;

  try {
    if (!qz.websocket.isActive()) {
      await connectQzTray();
    }

    // Determinar impressora
    let printerName = printer;
    if (!printerName) {
      printerName = await qz.printers.getDefault();
      if (!printerName) throw new Error("Nenhuma impressora configurada");
    }

    // Configurar encoding (deixe configurável)
    const encoding = options.encoding ?? "CP860";

    const config = qz.configs.create(printerName, { encoding });

    const commands = generateEscPosCommands(options);

    await qz.print(config, commands);

    return { success: true, printer: printerName };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido ao imprimir";

    return {
      success: false,
      error: errorMessage,
      printer: options.printer,
    };
  }
}

/**
 * Testa a impressão enviando uma senha de teste
 *
 * @param printer Nome da impressora (opcional)
 * @returns Resultado do teste
 */
export async function testPrint(printer?: string): Promise<PrintResult> {
  return printSenha({
    codigo: "TEST",
    guiche: "Teste",
    empresa: "TESTE DE IMPRESSÃO",
    printer,
    paperWidth: 42,
  } as PrintSenhaOptions);
}

/**
 * Verifica se o QZ Tray está instalado e disponível
 *
 * @returns true se está disponível
 */
export async function isQzTrayAvailable(): Promise<boolean> {
  try {
    // Tentar conectar com timeout
    const timeout = new Promise<boolean>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 3000),
    );

    const connect = connectQzTray().then(() => true);

    await Promise.race([connect, timeout]);
    return true;
  } catch {
    return false;
  }
}
