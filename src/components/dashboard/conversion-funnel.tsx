
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const funnelData = [
  { stage: "Visitas", value: 12830, conversion: 100 },
  { stage: "Leads (Página 1)", value: 4850, conversion: 37.8 },
  { stage: "Iniciaram Checkout", value: 1203, conversion: 24.8 },
  { stage: "Pagamento Aprovado", value: 541, conversion: 45.0 },
];

export function ConversionFunnel() {
  return (
    <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
        <CardTitle>Funil de Conversão</CardTitle>
        <CardDescription>
            Performance das etapas do funil nas últimas 24 horas.
        </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-6">
                {funnelData.map((step, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-muted-foreground">{step.stage}</span>
                            <span className="text-sm font-semibold">{step.value.toLocaleString('pt-BR')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Progress value={step.conversion} className="w-[85%]" />
                            <span className="text-xs font-bold w-[15%] text-right">{step.conversion.toFixed(1)}%</span>
                        </div>
                    </div>
                ))}
            </div>
        </CardContent>
    </Card>
  );
}
