
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const leadHistory = [
  { name: "Ana P.", email: "ana.p***@example.com", source: "Facebook Ads", status: "Aprovado", stage: "Pagamento", time: "2 min atrás" },
  { name: "Carlos S.", email: "carlos***@example.com", source: "Google Ads", status: "Pendente", stage: "Checkout", time: "5 min atrás" },
  { name: "Juliana M.", email: "juliana***@example.com", source: "Orgânico", status: "Recusado", stage: "Checkout", time: "8 min atrás" },
  { name: "Marcos R.", email: "marcos***@example.com", source: "Facebook Ads", status: "Aprovado", stage: "Pagamento", time: "12 min atrás" },
  { name: "Fernanda L.", email: "fernanda***@example.com", source: "Email", status: "Pendente", stage: "VSL", time: "15 min atrás" },
];

export function LeadHistoryTable() {
  return (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Histórico de Leads</CardTitle>
            <CardDescription>Os 5 leads mais recentes.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Origem</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leadHistory.map((lead, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium text-muted-foreground">
                            {(index + 1).toString().padStart(2, '0')}
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-xs text-muted-foreground">{lead.email}</div>
                        </TableCell>
                        <TableCell>
                            <Badge 
                                variant={lead.status === 'Aprovado' ? 'default' : lead.status === 'Pendente' ? 'secondary' : 'destructive'} 
                                className={`${lead.status === 'Aprovado' && 'bg-green-600'}`}>
                                {lead.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">{lead.source}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
