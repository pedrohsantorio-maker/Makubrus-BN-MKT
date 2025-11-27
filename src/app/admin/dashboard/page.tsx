'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, MousePointerClick } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CardDescription } from '@/components/ui/card';

interface Lead {
  id: string;
  createdAt: Timestamp;
  hasClickedFinalLink: boolean;
}

export default function DashboardPage() {
  const [totalVisits, setTotalVisits] = useState(0);
  const [finalLinkClicks, setFinalLinkClicks] = useState(0);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This component does not require authentication
    
    // Listener for total visits
    const leadsCollectionRef = collection(firestore, 'leads');
    const unsubscribeTotal = onSnapshot(leadsCollectionRef, (snapshot) => {
      setTotalVisits(snapshot.size);
      
      const leadsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            createdAt: data.createdAt,
            hasClickedFinalLink: data.hasClickedFinalLink
          } as Lead
      });
      
      leadsData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching total visits:", error);
        setLoading(false);
    });

    // Listener for final link clicks
    const clicksQuery = query(leadsCollectionRef, where('hasClickedFinalLink', '==', true));
    const unsubscribeClicks = onSnapshot(clicksQuery, (snapshot) => {
      setFinalLinkClicks(snapshot.size);
    }, (error) => {
        console.error("Error fetching final link clicks:", error);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeTotal();
      unsubscribeClicks();
    };
  }, []);

  const metricCards = [
    {
      title: "Total de Visitas",
      value: totalVisits,
      icon: Users,
      loading: loading,
    },
    {
      title: "Cliques no Link Final",
      value: finalLinkClicks,
      icon: MousePointerClick,
      loading: loading,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <main className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard de Monitoramento</h2>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metricCards.map((item, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {item.loading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{item.value.toLocaleString('pt-BR')}</div>
                )}
                <p className="text-xs text-muted-foreground">Contagem em tempo real</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Leads Recentes</CardTitle>
                <CardDescription>Lista de visitantes que acessaram o site.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID do Visitante</TableHead>
                            <TableHead>Data da Visita</TableHead>
                            <TableHead className='text-right'>Clicou no Link Final?</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                                    <TableCell className='text-right'><Skeleton className="h-5 w-10 ml-auto" /></TableCell>
                                </TableRow>
                            ))
                        ) : (
                            leads.map((lead) => (
                                <TableRow key={lead.id}>
                                    <TableCell className='font-mono text-xs'>{lead.id}</TableCell>
                                    <TableCell>
                                        {lead.createdAt ? format(lead.createdAt.toDate(), "dd/MM/yyyy HH:mm:ss", { locale: ptBR }) : 'N/A'}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <Badge variant={lead.hasClickedFinalLink ? 'default' : 'secondary'} className={lead.hasClickedFinalLink ? 'bg-green-600' : ''}>
                                            {lead.hasClickedFinalLink ? 'Sim' : 'Não'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
