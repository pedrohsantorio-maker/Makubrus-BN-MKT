
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/firebase/firebase-provider';
import { Skeleton } from '../ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function LeadHistoryTable() {
    const { recentLeads, loading } = useAnalytics();

    if (loading) {
        return (
            <Card className="col-span-3">
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[150px]" />
                                    <Skeleton className="h-4 w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

  return (
    <Card className="col-span-3">
        <CardHeader>
            <CardTitle>Histórico de Leads</CardTitle>
            <CardDescription>Os 5 leads mais recentes que chegaram na VSL.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Horário</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentLeads.map((lead, index) => (
                    <TableRow key={lead.id}>
                        <TableCell className="font-medium text-muted-foreground">
                            {(index + 1).toString().padStart(2, '0')}
                        </TableCell>
                        <TableCell>
                            <div className="font-medium">Lead #{lead.sessionId.substring(0, 6)}</div>
                            <div className="text-xs text-muted-foreground">Sessão anônima</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary">
                                Visualizou VSL
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                            {formatDistanceToNow(lead.createdAt.toDate(), { addSuffix: true, locale: ptBR })}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
  );
}
