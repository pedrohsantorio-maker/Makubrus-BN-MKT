
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const dailyData = [
  { date: '01/06', Leads: 22, Vendas: 10 },
  { date: '02/06', Leads: 35, Vendas: 15 },
  { date: '03/06', Leads: 42, Vendas: 21 },
  { date: '04/06', Leads: 30, Vendas: 12 },
  { date: '05/06', Leads: 55, Vendas: 28 },
  { date: '06/06', Leads: 60, Vendas: 32 },
  { date: '07/06', Leads: 48, Vendas: 25 },
];

export function UserBehavior() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Comportamento (Últimos 7 dias)</CardTitle>
        <CardDescription>Evolução de leads e vendas.</CardDescription>
      </CardHeader>
      <CardContent className="pl-2 h-[350px]">
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
      </CardContent>
    </Card>
  );
}
