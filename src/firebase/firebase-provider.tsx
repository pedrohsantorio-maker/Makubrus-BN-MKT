
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
}

const AnalyticsContext = createContext<AnalyticsData>({
  loading: true,
  activeLeads: 0,
  leadsLast24h: 0,
  totalConversions: 0,
  funnelData: [],
  recentLeads: [],
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
  });

  useEffect(() => {
    if (!firestore) {
        console.warn("Firestore is not initialized. Real-time analytics will be disabled.");
        setAnalyticsData(prev => ({...prev, loading: false }));
        return;
    };

    const twentyFourHoursAgo = Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000));

    // --- Query for all relevant events in the last 24 hours ---
    const eventsQuery = query(
      collection(firestore, "events"),
      where("createdAt", ">", twentyFourHoursAgo)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
        const events = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        const uniqueSessionIds = (eventName: string | string[]) => {
            const names = Array.isArray(eventName) ? eventName : [eventName];
            return new Set(
                events
                    .filter(e => names.includes(e.name))
                    .map(e => e.sessionId)
            );
        };
        
        // --- Active Leads (active in last 5 mins) ---
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const activeUsers = new Set(
            events
                .filter(e => e.createdAt.toDate() > fiveMinutesAgo)
                .map(e => e.sessionId)
        );

        // --- Leads Last 24h (viewed VSL) ---
        const leads24h = uniqueSessionIds("view_vsl");

        // --- Total Conversions (clicked final CTA) ---
        const totalConversions = uniqueSessionIds(["main_cta_click", "final_cta_click"]);

        // --- Funnel Data ---
        const funnelStep1 = uniqueSessionIds("age_gate");
        const funnelStep2 = uniqueSessionIds("view_vsl");
        const funnelStep3 = totalConversions;

        const funnelData = [
          { stage: "Visitas na Age Gate", value: funnelStep1.size, conversion: 100 },
          { stage: "Visualizaram VSL", value: funnelStep2.size, conversion: funnelStep1.size > 0 ? (funnelStep2.size / funnelStep1.size) * 100 : 0 },
          { stage: "Conversões (CTA Vendas)", value: funnelStep3.size, conversion: funnelStep2.size > 0 ? (funnelStep3.size / funnelStep2.size) * 100 : 0 },
        ];


        setAnalyticsData(prev => ({
            ...prev,
            activeLeads: activeUsers.size,
            leadsLast24h: leads24h.size,
            totalConversions: totalConversions.size,
            funnelData,
            loading: false, // Data has been loaded
        }));
    });

    // --- Recent Leads (last 5 to view VSL) ---
    const recentLeadsQuery = query(
        collection(firestore, "events"),
        where("name", "==", "view_vsl"),
        orderBy("createdAt", "desc"),
        limit(5)
    );

    const unsubscribeRecentLeads = onSnapshot(recentLeadsQuery, (snapshot) => {
        const leads = snapshot.docs.map(doc => ({
            id: doc.id,
            sessionId: doc.data().sessionId,
            createdAt: doc.data().createdAt,
        }));
        setAnalyticsData(prev => ({ ...prev, recentLeads: leads, loading: false }));
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
