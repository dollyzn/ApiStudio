/**
 * Tipos TypeScript para o sistema de impressão térmica com QZ Tray
 */

/**
 * Configuração da impressora
 */
export interface PrintConfig {
  /** Nome da impressora selecionada */
  printerName: string;
  /** Largura do papel em mm (58mm ou 80mm) */
  paperWidth: 58 | 80;
  /** Densidade de impressão (1 = leve, 2 = médio, 3 = forte) */
  density?: 1 | 2 | 3;
  /** Codificação de caracteres (padrão: CP860 para português) */
  encoding?: string;
}

/**
 * Dados da senha de atendimento
 */
export interface SenhaData {
  /** Código da senha (ex: A023) */
  codigo: string;
  /** Data e hora de emissão */
  dataHora: Date;
  /** Guichê ou setor (opcional) */
  guiche?: string;
  /** Nome da empresa (padrão: CERO IMAGEM) */
  empresa?: string;
}

/**
 * Status da conexão com QZ Tray
 */
export type QzConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

/**
 * Informações sobre uma impressora disponível
 */
export interface PrinterInfo {
  /** Nome da impressora */
  name: string;
  /** Descrição (se disponível) */
  description?: string;
  /** Se é a impressora padrão do sistema */
  isDefault?: boolean;
}

/**
 * Resultado de uma operação de impressão
 */
export interface PrintResult {
  /** Se a impressão foi bem-sucedida */
  success: boolean;
  /** Mensagem de erro (se houver) */
  error?: string;
  /** Impressora utilizada */
  printer?: string;
}

/**
 * Configuração de segurança do QZ Tray
 */
export interface QzSecurityConfig {
  /** URL do certificado público (.crt) */
  certificateUrl: string;
  /** Endpoint para assinatura (private key no backend) */
  signatureEndpoint: string;
}

/**
 * Opções para impressão de senha
 */
export interface PrintSenhaOptions {
  /** Código */
  codigo: string;
  /** Senha */
  senha: string;
  /** Guichê ou setor (opcional) */
  guiche?: string;
  /** Nome da empresa (opcional, padrão: CERO IMAGEM) */
  empresa?: string;
  /** Impressora específica (opcional, usa a selecionada se não informado) */
  printer?: string;
  paperWidth?: 32 | 42; // 58mm ou 80mm (ou number)
  cutMode?: "partial" | "full";
  encoding?: "CP860" | "CP850" | "UTF-8" | string;
  fontHeaderMode?: number;
  fontSenhaLabelMode?: number;
  fontCodigoMode?: number;
}
