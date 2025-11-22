"use client";

import { useEffect, useState } from 'react';
import { useAnalytics } from '@/firebase/firebase-provider';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '../ui/skeleton';

export function LastUpdateStatus() {
  const { lastUpdatedAt, loading } = useAnalytics();
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (lastUpdatedAt) {
      const update = () => {
        setTimeAgo(formatDistanceToNow(lastUpdatedAt, { addSuffix: true, locale: ptBR }));
      };
      update();
      const intervalId = setInterval(update, 1000);
      return () => clearInterval(intervalId);
    }
  }, [lastUpdatedAt]);

  if (loading) {
    return <Skeleton className="h-5 w-40" />;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </div>
      <span>
        {timeAgo ? `Atualizado ${timeAgo}` : 'Aguardando dados...'}
      </span>
    </div>
  );
}
