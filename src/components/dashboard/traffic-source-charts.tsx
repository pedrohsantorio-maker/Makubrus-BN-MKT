
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const trafficData: any[] = [
  // Static data removed, will be populated from analytics
];

const deviceData: any[] = [
    // Static data removed, will be populated from analytics
]

export function TrafficSourceCharts() {
  return (
    <Card className="col-span-4">
        <CardHeader>
        <CardTitle>Origem do Tráfego</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-2 h-[350px]">
            {trafficData.length > 0 ? (
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
            ) : (
                <div className="flex items-center justify-center text-muted-foreground text-sm">Dados de origem de tráfego indisponíveis.</div>
            )}
            {deviceData.length > 0 ? (
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
             ) : (
                <div className="flex items-center justify-center text-muted-foreground text-sm">Dados de dispositivo indisponíveis.</div>
            )}
        </CardContent>
    </Card>
  );
}
