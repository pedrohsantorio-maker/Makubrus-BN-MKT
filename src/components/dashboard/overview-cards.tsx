
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, CreditCard } from 'lucide-react';
import { useAnalytics } from '@/firebase/firebase-provider';

export function OverviewCards() {
  const { activeLeads, leadsLast24h, totalConversions } = useAnalytics();

  const overviewData = [
    { title: "Leads (24h)", value: `+${leadsLast24h}`, change: "from last 24h", icon: Users },
    { title: "Conversões", value: `+${totalConversions}`, change: "total", icon: CreditCard },
    { title: "Leads Ativos Agora", value: `${activeLeads}`, change: "Em tempo real", icon: Activity },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
