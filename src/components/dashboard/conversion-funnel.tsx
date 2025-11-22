
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAnalytics } from '@/firebase/firebase-provider';
import { Skeleton } from '@/components/ui/skeleton';

export function ConversionFunnel() {
  const { funnelData, loading } = useAnalytics();

  if (loading) {
    return (
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/6" />
              </div>
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

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
