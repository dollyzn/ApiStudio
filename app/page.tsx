import { Suspense } from "react"
import MessageConfirmationForm from "@/components/message-confirmation-form"
import { ThemeToggle } from "@/components/theme-toggle"

export const metadata = {
  title: "Confirmação de Envio - API Studio",
  description: "Interface de envio de mensagens para Chatwoot",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-muted-foreground">Carregando...</div>
          </div>
        }
      >
        <MessageConfirmationForm />
      </Suspense>
    </div>
  )
}
