
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const trafficData = [
  { name: 'Google Ads', value: 400, fill: 'hsl(var(--chart-1))' },
  { name: 'Facebook Ads', value: 300, fill: 'hsl(var(--chart-2))' },
  { name: 'Orgânico', value: 200, fill: 'hsl(var(--chart-3))' },
  { name: 'Email', value: 278, fill: 'hsl(var(--chart-4))' },
  { name: 'Outros', value: 189, fill: 'hsl(var(--chart-5))' },
];

const deviceData = [
    { name: 'Desktop', value: 45, fill: 'hsl(var(--chart-1))' },
    { name: 'Mobile', value: 55, fill: 'hsl(var(--chart-2))' },
]

export function TrafficSourceCharts() {
  return (
    <Card className="col-span-4">
        <CardHeader>
        <CardTitle>Origem do Tráfego</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData} layout="vertical" margin={{ left: 10, right: 10 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip cursor={{ fill: 'hsla(var(--muted))' }} />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={15}>
                        {trafficData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend iconSize={10} />
                </PieChart>
            </ResponsiveContainer>
        </CardContent>
    </Card>
  );
}
