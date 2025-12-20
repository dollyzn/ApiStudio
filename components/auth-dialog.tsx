"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/hooks/useAuth";

export function AuthDialog() {
  const { token, validateToken, isValidating } = useAuth();

  const [localToken, setLocalToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isOpen = !token;

  const handleValidate = async () => {
    setError(null);

    if (!localToken.trim()) {
      setError("Informe o token.");
      return;
    }

    const isValid = await validateToken(localToken.trim());

    if (!isValid) {
      setError("Token inválido. Verifique e tente novamente.");
    } else {
      setLocalToken("");
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Autenticação Necessária</DialogTitle>
          <DialogDescription>
            Informe o token de autenticação para acessar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <div className="grid gap-2">
            <Label htmlFor="token">Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Cole seu token aqui"
              value={localToken}
              onChange={(e) => setLocalToken(e.target.value)}
              disabled={isValidating}
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <Button onClick={handleValidate} disabled={isValidating}>
          {isValidating ? "Validando..." : "Validar Token"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
