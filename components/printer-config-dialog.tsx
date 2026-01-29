"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, RefreshCw, TestTube, Plug, PlugZap } from "lucide-react";
import { usePrinter } from "@/contexts/printer-provider";

export function PrinterConfigDialog({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const {
    connectionStatus,
    isConnected,
    printers,
    selectedPrinter,
    isLoadingPrinters,
    connect,
    disconnect,
    refreshPrinters,
    selectPrinter,
    testPrinter,
  } = usePrinter();

  const handleConnect = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  const handleRefresh = async () => {
    if (isConnected) {
      await refreshPrinters();
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      await testPrinter();
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected":
        return "text-green-600";
      case "connecting":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case "connected":
        return "Conectado";
      case "connecting":
        return "Conectando...";
      case "error":
        return "Erro na conexão";
      default:
        return "Desconectado";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Printer className="size-4" />
          Configurar Impressora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configuração de Impressora</DialogTitle>
          <DialogDescription>
            Configure a impressora térmica para impressão de senhas
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          {/* Status da Conexão */}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Status do QZ Tray</Label>
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {getStatusText()}
              </span>
            </div>
            <Button
              onClick={handleConnect}
              variant={isConnected ? "destructive" : "default"}
              disabled={connectionStatus === "connecting"}
              className="w-full"
            >
              {isConnected ? (
                <>
                  <PlugZap className="size-4" />
                  Desconectar
                </>
              ) : (
                <>
                  <Plug className="size-4" />
                  Conectar ao QZ Tray
                </>
              )}
            </Button>
          </div>

          {/* Seleção de Impressora */}
          {isConnected && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="printer">Impressora</Label>

                <div className="flex items-center gap-2">
                  {printers.length > 0 ? (
                    <Select
                      value={selectedPrinter || undefined}
                      onValueChange={selectPrinter}
                      disabled={isLoadingPrinters}
                    >
                      <SelectTrigger id="printer">
                        <SelectValue placeholder="Selecione uma impressora" />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="max-h-50">
                          {printers.map((printer) => (
                            <SelectItem key={printer.name} value={printer.name}>
                              {printer.name}
                              {printer.isDefault && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (Padrão)
                                </span>
                              )}
                            </SelectItem>
                          ))}
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm py-2 px-3 bg-input/20 border rounded-md">
                      {isLoadingPrinters
                        ? "Carregando impressoras..."
                        : "Nenhuma impressora encontrada"}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoadingPrinters}
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${isLoadingPrinters ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              {/* Teste de Impressão */}
              {selectedPrinter && (
                <div className="grid gap-2">
                  <Label>Teste</Label>
                  <Button
                    onClick={handleTest}
                    disabled={isTesting || !selectedPrinter}
                    variant="outline"
                    className="w-full"
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    {isTesting ? "Testando..." : "Imprimir Teste"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Instruções */}
          {!isConnected && (
            <div className="rounded-md bg-muted p-3 text-sm">
              <p className="font-medium mb-1">Instruções:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Certifique-se de que o QZ Tray está instalado</li>
                <li>Verifique se o QZ Tray está em execução</li>
                <li>Clique em "Conectar ao QZ Tray"</li>
                <li>Selecione sua impressora térmica</li>
              </ol>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
