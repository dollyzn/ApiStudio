import "./globals.css";

import type React from "react";
import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { fontMono, fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/auth-provider";
import { PrinterProvider } from "@/contexts/printer-provider";

export const metadata: Metadata = {
  title: "API Studio - Chatwoot",
  description: "Interface segura para envio de mensagens via Chatwoot",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={cn(
          "font-sans antialiased",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <PrinterProvider autoConnect>
              {children}
              <Toaster closeButton richColors />
            </PrinterProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
