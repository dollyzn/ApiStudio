"use client";

import { Suspense } from "react";
import MessageConfirmationForm from "@/components/message-confirmation-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/lib/hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AuthDialog />

      {isAuthenticated && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-muted-foreground">Carregando...</div>
            </div>
          }
        >
          <MessageConfirmationForm />
        </Suspense>
      )}
    </div>
  );
}
