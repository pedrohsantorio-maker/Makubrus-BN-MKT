
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const dailyData: any[] = [
    // Static data removed, will be populated from analytics
];

export function UserBehavior() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Comportamento (Últimos 7 dias)</CardTitle>
        <CardDescription>Evolução de leads e vendas.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2 h-[350px]">
        {dailyData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsla(var(--border) / 0.5)" />
                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="Leads" stroke="hsl(var(--chart-1))" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Vendas" stroke="hsl(var(--chart-2))" strokeWidth={2} />
            </LineChart>
            </ResponsiveContainer>
        ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Dados de comportamento indisponíveis.
            </div>
        )}
      </CardContent>
    </Card>
  );
}
