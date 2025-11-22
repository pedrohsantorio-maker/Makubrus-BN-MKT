
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, onSnapshot, query, where, Timestamp } from 'firebase/firestore';

interface AnalyticsData {
  activeLeads: number;
  leadsLast24h: number;
  totalConversions: number;
  averageTicket: number;
}

const AnalyticsContext = createContext<AnalyticsData>({
  activeLeads: 0,
  leadsLast24h: 0,
  totalConversions: 0,
  averageTicket: 49.90,
});

export const useAnalytics = () => useContext(AnalyticsContext);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    activeLeads: 0,
    leadsLast24h: 0,
    totalConversions: 0,
    averageTicket: 49.90,
  });

  useEffect(() => {
    if (!firestore) return;

    // --- Active Leads (last 5 minutes) ---
    const activeLeadsQuery = query(
      collection(firestore, "events"),
      where("createdAt", ">", Timestamp.fromDate(new Date(Date.now() - 5 * 60 * 1000)))
    );

    const unsubscribeActiveLeads = onSnapshot(activeLeadsQuery, (snapshot) => {
        const uniqueUsers = new Set(snapshot.docs.map(doc => doc.data().sessionId));
        setAnalyticsData(prev => ({ ...prev, activeLeads: uniqueUsers.size }));
    });

    // --- Leads in last 24h (started loading sequence) ---
    const leads24hQuery = query(
        collection(firestore, "events"),
        where("name", "==", "loading_started"),
        where("createdAt", ">", Timestamp.fromDate(new Date(Date.now() - 24 * 60 * 60 * 1000)))
    );

    const unsubscribeLeads24h = onSnapshot(leads24hQuery, (snapshot) => {
        const uniqueUsers = new Set(snapshot.docs.map(doc => doc.data().sessionId));
        setAnalyticsData(prev => ({ ...prev, leadsLast24h: uniqueUsers.size }));
    });

    // --- Total Conversions (clicked final CTA on sales page) ---
    const conversionsQuery = query(
        collection(firestore, "events"),
        where("name", "in", ["main_cta_click", "final_cta_click"])
    );

    const unsubscribeConversions = onSnapshot(conversionsQuery, (snapshot) => {
        setAnalyticsData(prev => ({ ...prev, totalConversions: snapshot.size }));
    });

    return () => {
      unsubscribeActiveLeads();
      unsubscribeLeads24h();
      unsubscribeConversions();
    };
  }, []);

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      {children}
    </AnalyticsContext.Provider>
  );
};
