/**
 * Provider de contexto para gerenciar impressoras térmicas via QZ Tray
 *
 * Fornece estado global para:
 * - Conexão com QZ Tray
 * - Lista de impressoras disponíveis
 * - Impressora selecionada (persistida em localStorage)
 * - Funções de impressão
 *
 * @module contexts/printer-provider
 */

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useLocalStorage } from "usehooks-ts";
import { toast } from "sonner";
import {
  connectQzTray,
  disconnectQzTray,
  getPrinters,
  printSenha as qzPrintSenha,
  testPrint,
  onStatusChange,
  getConnectionStatus,
  isQzTrayAvailable,
} from "@/lib/qz-tray";
import type {
  PrinterInfo,
  PrintResult,
  QzConnectionStatus,
  PrintSenhaOptions,
} from "@/types/print";

interface PrinterContextData {
  /** Status da conexão com QZ Tray */
  connectionStatus: QzConnectionStatus;
  /** Se está conectado ao QZ Tray */
  isConnected: boolean;
  /** Lista de impressoras disponíveis */
  printers: PrinterInfo[];
  /** Nome da impressora selecionada */
  selectedPrinter: string | null;
  /** Se está carregando impressoras */
  isLoadingPrinters: boolean;
  /** Conecta ao QZ Tray */
  connect: () => Promise<void>;
  /** Desconecta do QZ Tray */
  disconnect: () => Promise<void>;
  /** Atualiza lista de impressoras */
  refreshPrinters: () => Promise<void>;
  /** Define a impressora selecionada */
  selectPrinter: (printerName: string | null) => void;
  /** Imprime uma senha */
  printSenha: (
    options: Omit<PrintSenhaOptions, "printer">,
  ) => Promise<PrintResult>;
  /** Testa a impressão */
  testPrinter: () => Promise<PrintResult>;
}

const PrinterContext = createContext<PrinterContextData | null>(null);

/**
 * Hook para acessar o contexto de impressoras
 */
export function usePrinter(): PrinterContextData {
  const context = useContext(PrinterContext);
  if (!context) {
    throw new Error("usePrinter deve ser usado dentro de PrinterProvider");
  }
  return context;
}

interface PrinterProviderProps {
  children: ReactNode;
  /** Se deve conectar automaticamente ao montar */
  autoConnect?: boolean;
}

/**
 * Provider de contexto para gerenciamento de impressoras
 */
export function PrinterProvider({
  children,
  autoConnect = false,
}: PrinterProviderProps) {
  const [connectionStatus, setConnectionStatus] =
    useState<QzConnectionStatus>("disconnected");
  const [printers, setPrinters] = useState<PrinterInfo[]>([]);
  const [isLoadingPrinters, setIsLoadingPrinters] = useState(false);

  // Persistir impressora selecionada no localStorage
  const [selectedPrinter, setSelectedPrinter] = useLocalStorage<string | null>(
    "qz_selected_printer",
    null,
  );

  const isConnected = connectionStatus === "connected";

  /**
   * Conecta ao QZ Tray
   */
  const connect = useCallback(async (silent = false) => {
    try {
      await connectQzTray();
      if (!silent) toast.success("Conectado ao QZ Tray");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao conectar";
      toast.error(message);
      throw error;
    }
  }, []);

  /**
   * Desconecta do QZ Tray
   */
  const disconnect = useCallback(async () => {
    try {
      await disconnectQzTray();
      setPrinters([]);
      toast.info("Desconectado do QZ Tray");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    }
  }, []);

  /**
   * Atualiza lista de impressoras
   */
  const refreshPrinters = useCallback(async () => {
    setIsLoadingPrinters(true);
    try {
      const printerList = await getPrinters();
      setPrinters(printerList);

      // Se não há impressora selecionada, selecionar a padrão
      if (!selectedPrinter && printerList.length > 0) {
        const defaultPrinter = printerList.find((p) => p.isDefault);
        if (defaultPrinter) {
          setSelectedPrinter(defaultPrinter.name);
        }
      }

      if (
        selectedPrinter &&
        !printerList.some((p) => p.name === selectedPrinter)
      ) {
        setSelectedPrinter(null);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao listar impressoras";
      toast.error(message);
      setPrinters([]);
    } finally {
      setIsLoadingPrinters(false);
    }
  }, [selectedPrinter, setSelectedPrinter]);

  /**
   * Define a impressora selecionada
   */
  const selectPrinter = useCallback(
    (printerName: string | null) => {
      setSelectedPrinter(printerName);
    },
    [setSelectedPrinter],
  );

  /**
   * Imprime uma senha usando a impressora selecionada
   */
  const printSenha = useCallback(
    async (
      options: Omit<PrintSenhaOptions, "printer">,
    ): Promise<PrintResult> => {
      if (!selectedPrinter) {
        const error = "Nenhuma impressora selecionada";
        toast.error(error);
        return { success: false, error };
      }

      try {
        const result = await qzPrintSenha({
          ...options,
          printer: selectedPrinter,
        });

        if (result.success) {
          toast.success(
            `Código e senha '${options.codigo}' impressos com sucesso`,
          );
        } else {
          toast.error(result.error || "Erro ao imprimir");
        }

        return result;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro ao imprimir";
        toast.error(message);
        return { success: false, error: message };
      }
    },
    [selectedPrinter],
  );

  /**
   * Testa a impressão na impressora selecionada
   */
  const testPrinter = useCallback(async (): Promise<PrintResult> => {
    if (!selectedPrinter) {
      const error = "Nenhuma impressora selecionada";
      toast.error(error);
      return { success: false, error };
    }

    try {
      const result = await toast
        .promise(testPrint(selectedPrinter), {
          loading: "Enviando impressão de teste...",
          success: "Impressão de teste enviada",
          error: (error) => error || "Erro no teste de impressão",
        })
        .unwrap();

      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro no teste";
      toast.error(message);
      return { success: false, error: message };
    }
  }, [selectedPrinter]);

  /**
   * Listener para mudanças de status da conexão
   */
  useEffect(() => {
    const unsubscribe = onStatusChange(setConnectionStatus);
    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Auto-conectar se solicitado
   */
  useEffect(() => {
    if (autoConnect) {
      (async () => {
        const available = await isQzTrayAvailable();
        if (available) {
          try {
            await connect(true);
          } catch {
            // Silenciar erro na auto-conexão
          }
        }
      })();
    }
  }, [autoConnect, connect]);

  /**
   * Carregar impressoras quando conectar
   */
  useEffect(() => {
    if (isConnected) {
      refreshPrinters();
    }
  }, [isConnected]);

  const value: PrinterContextData = {
    connectionStatus,
    isConnected,
    printers,
    selectedPrinter,
    isLoadingPrinters,
    connect,
    disconnect,
    refreshPrinters,
    selectPrinter,
    printSenha,
    testPrinter,
  };

  return (
    <PrinterContext.Provider value={value}>{children}</PrinterContext.Provider>
  );
}
