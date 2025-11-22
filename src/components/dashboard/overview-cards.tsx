
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Activity, CreditCard } from 'lucide-react';

const overviewData = [
    { title: "Leads (24h)", value: "+1,234", change: "+15.2% from last 24h", icon: Users },
    { title: "Conversões", value: "+213", change: "+12.1% from last 24h", icon: CreditCard },
    { title: "Ticket Médio", value: "R$ 49,90", change: "+5.3%", icon: DollarSign },
    { title: "Leads Ativos Agora", value: "89", change: "Em tempo real", icon: Activity },
]

export function OverviewCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewData.map((item, index) => (
            <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {item.title}
                </CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">
                    {item.change}
                </p>
                </CardContent>
            </Card>
        ))}
    </div>
  );
}
