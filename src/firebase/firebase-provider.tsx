
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestore } from '@/lib/firebase';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';

interface LiveAnalyticsData {
  activeSessions: { [sessionId: string]: string };
  funnel: {
    ageGateViews: number;
    vslViews: number;
    ctaClicks: number;
    purchases: number;
  };
  recentLeads: { id: string; sessionId: string; createdAt: string }[]; // Keep as string from backend
  lastUpdatedAt: Timestamp;
}

interface AnalyticsContextData {
  loading: boolean;
  activeLeads: number;
  leadsLast24h: number; 
  totalConversions: number; 
  funnelData: { stage: string; value: number; conversion: number }[];
  recentLeads: { id: string; sessionId: string; createdAt: Timestamp }[]; // Keep as Timestamp for frontend
  lastUpdatedAt: Date | null;
}

const AnalyticsContext = createContext<AnalyticsContextData>({
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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsContextData>({
    loading: true,
    activeLeads: 0,
    leadsLast24h: 0, 
    totalConversions: 0,
    funnelData: [
      { stage: "Visitas na Age Gate", value: 0, conversion: 100 },
      { stage: "Visualizaram VSL", value: 0, conversion: 0 },
      { stage: "Cliques no CTA (Vendas)", value: 0, conversion: 0 },
      { stage: "Compras", value: 0, conversion: 0 },
    ],
    recentLeads: [],
    lastUpdatedAt: null,
  });

  useEffect(() => {
    if (!firestore) {
      console.warn("Firestore client is not initialized. Real-time analytics will be disabled.");
      setAnalyticsData(prev => ({ ...prev, loading: false }));
      return;
    }

    const liveDocRef = doc(firestore, "analytics_aggregates", "live");

    const unsubscribe = onSnapshot(liveDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as LiveAnalyticsData;

        const { ageGateViews = 0, vslViews = 0, ctaClicks = 0, purchases = 0 } = data.funnel || {};
        
        const funnelData = [
          { 
            stage: "Visitas na Age Gate", 
            value: ageGateViews, 
            conversion: 100 
          },
          { 
            stage: "Visualizaram VSL", 
            value: vslViews, 
            conversion: ageGateViews > 0 ? (vslViews / ageGateViews) * 100 : 0 
          },
          { 
            stage: "Cliques no CTA (Vendas)", 
            value: ctaClicks, 
            conversion: vslViews > 0 ? (ctaClicks / vslViews) * 100 : 0 
          },
          {
            stage: "Compras",
            value: purchases,
            conversion: ctaClicks > 0 ? (purchases / ctaClicks) * 100 : 0
          }
        ];

        const activeLeadsCount = data.activeSessions ? Object.keys(data.activeSessions).length : 0;
        
        // The `createdAt` in recentLeads is now a Timestamp from Firestore
        const processedRecentLeads = (data.recentLeads || []).map(lead => ({
          ...lead,
          createdAt: new Timestamp(
              (lead.createdAt as any)._seconds,
              (lead.createdAt as any)._nanoseconds
          )
        }));


        setAnalyticsData({
          loading: false,
          activeLeads: activeLeadsCount,
          leadsLast24h: vslViews,
          totalConversions: purchases,
          funnelData,
          recentLeads: processedRecentLeads,
          lastUpdatedAt: data.lastUpdatedAt ? data.lastUpdatedAt.toDate() : new Date(),
        });
      } else {
        console.log("Live analytics document not found. Waiting for first event.");
        setAnalyticsData(prev => ({ ...prev, loading: false, lastUpdatedAt: new Date() }));
      }
    }, (error) => {
        console.error("Error fetching live analytics:", error);
        setAnalyticsData(prev => ({ ...prev, loading: false }));
    });

    return () => unsubscribe();
  }, []);

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      {children}
    </AnalyticsContext.Provider>
  );
};
