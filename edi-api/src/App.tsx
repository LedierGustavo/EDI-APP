import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { CotacaoForm } from "./components/CotacaoForm";
import { ResultadoCotacao } from "./components/ResultadoCotacao";
import { Button } from "./components/ui/button";
import { useCotacaoLast } from "./hooks/useCotacao";
import { Package, Settings } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppContent() {
  const ultimaCotacao = useCotacaoLast();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">EDI API</h1>
              <p className="text-xs text-muted-foreground">Braspress - Cotação de Frete</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="gap-1">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <CotacaoForm />
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-20 space-y-4">
              <ResultadoCotacao data={ultimaCotacao} />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-4">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          EDI API v0.1.0 - Braspress &copy; 2026
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;