"use client";

import { Suspense, useEffect } from "react";
import MessageConfirmationForm from "@/components/message-confirmation-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuth } from "@/contexts/auth-provider";
import { MessageConfirmationSkeleton } from "@/components/message-confirmation-skeleton";

export default function HomePage() {
  const { isAuthenticated, isValidating, validateToken, token } = useAuth();

  useEffect(() => {
    if (token) validateToken(token);
  }, [token]);

  return (
    <div className="min-h-screen h-px bg-linear-to-br from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AuthDialog />

      {isValidating ? (
        <MessageConfirmationSkeleton />
      ) : (
        isAuthenticated && (
          <Suspense fallback={<MessageConfirmationSkeleton />}>
            <MessageConfirmationForm />
          </Suspense>
        )
      )}
    </div>
  );
}
