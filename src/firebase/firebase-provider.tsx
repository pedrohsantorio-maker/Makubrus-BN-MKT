
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, onSnapshot, query, where, Timestamp, orderBy, limit } from 'firebase/firestore';

interface AnalyticsData {
  loading: boolean;
  activeLeads: number;
  leadsLast24h: number;
  totalConversions: number;
  funnelData: { stage: string; value: number; conversion: number }[];
  recentLeads: { id: string; sessionId: string; createdAt: Timestamp }[];
  lastUpdatedAt: Date | null;
}

const AnalyticsContext = createContext<AnalyticsData>({
  loading: true,
  activeLeads: 0,
  leadsLast24h: 0,
  totalConversions: 0,
  funnelData: [],
  recentLeads: [],
  lastUpdatedAt: null,
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    loading: true,
    activeLeads: 0,
    leadsLast24h: 0,
    totalConversions: 0,
    funnelData: [
      { stage: "Visitas Iniciais", value: 0, conversion: 100 },
      { stage: "Visualizaram VSL", value: 0, conversion: 0 },
      { stage: "Cliquaram no CTA (Vendas)", value: 0, conversion: 0 },
    ],
    recentLeads: [],
    lastUpdatedAt: null,
  });

  useEffect(() => {
    if (!firestore) {
        console.warn("Firestore is not initialized. Real-time analytics will be disabled.");
        setAnalyticsData(prev => ({...prev, loading: false }));
        return;
    };

    const twentyFourHoursAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

    const eventsQuery = query(
      collection(firestore, "events"),
      where("createdAt", ">", twentyFourHoursAgo)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
        const events = snapshot.docs.map(doc => ({ ...(doc.data() as { name: string; sessionId: string; createdAt: Timestamp }), id: doc.id }));
        
        const uniqueSessionIdsForEvent = (eventName: string | string[]) => {
            const names = Array.isArray(eventName) ? eventName : [eventName];
            return new Set(
                events
                    .filter(e => names.includes(e.name))
                    .map(e => e.sessionId)
            );
        };
        
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsers = new Set(
            events
                .filter(e => e.createdAt.toDate() > fiveMinutesAgo)
                .map(e => e.sessionId)
        );

        const leads24h = uniqueSessionIdsForEvent("loading_started");

        const totalConversionsSet = uniqueSessionIdsForEvent(["main_cta_click", "final_cta_click"]);

        const funnelStep1 = uniqueSessionIdsForEvent("age_gate");
        const funnelStep2 = uniqueSessionIdsForEvent("view_vsl");
        const funnelStep3 = uniqueSessionIdsForEvent("cta_click");

        const funnelData = [
          { stage: "Visitas na Age Gate", value: funnelStep1.size, conversion: 100 },
          { stage: "Visualizaram VSL", value: funnelStep2.size, conversion: funnelStep1.size > 0 ? (funnelStep2.size / funnelStep1.size) * 100 : 0 },
          { stage: "Conversões (CTA Vendas)", value: funnelStep3.size, conversion: funnelStep2.size > 0 ? (funnelStep3.size / funnelStep2.size) * 100 : 0 },
        ];


        setAnalyticsData(prev => ({
            ...prev,
            activeLeads: activeUsers.size,
            leadsLast24h: leads24h.size,
            totalConversions: totalConversionsSet.size,
            funnelData,
            loading: false,
            lastUpdatedAt: new Date(),
        }));
    });

    const recentLeadsQuery = query(
        collection(firestore, "events"),
        where("name", "==", "view_vsl"),
        orderBy("createdAt", "desc"),
        limit(5)
    );

    const unsubscribeRecentLeads = onSnapshot(recentLeadsQuery, (snapshot) => {
        const leads = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                sessionId: data.sessionId || 'N/A',
                createdAt: data.createdAt || Timestamp.now(),
            };
        });
        setAnalyticsData(prev => ({ 
            ...prev, 
            recentLeads: leads, 
            loading: prev.loading,
            lastUpdatedAt: new Date()
        }));
    });


    return () => {
      unsubscribeEvents();
      unsubscribeRecentLeads();
    };
  }, []);

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      {children}
    </AnalyticsContext.Provider>
  );
};
