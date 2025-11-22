
'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingDown } from "lucide-react";

export function SmartAlerts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Nenhum lead nos últimos 15 minutos</AlertTitle>
            <AlertDescription>
                Verifique se as campanhas de tráfego estão ativas e funcionando corretamente.
            </AlertDescription>
        </Alert>
        <Alert variant="destructive">
            <TrendingDown className="h-4 w-4" />
            <AlertTitle>Queda anormal no funil</AlertTitle>
            <AlertDescription>
                A conversão da etapa "Leads" para "Iniciaram Checkout" caiu 35% na última hora.
            </AlertDescription>
        </Alert>
    </div>
  );
}
