
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { firestore } from '@/lib/firebase';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';

// This interface defines the structure of our aggregated analytics data
// that we expect to receive from Firestore.
interface LiveAnalyticsData {
  activeSessions: { [sessionId: string]: number };
  funnel: {
    ageGateViews: number;
    vslViews: number;
    ctaClicks: number;
    purchases: number;
  };
  recentLeads: { id: string; sessionId: string; createdAt: Timestamp }[];
  lastUpdatedAt: Timestamp;
}

// This interface defines the data structure provided by our context.
// It's a processed version of the raw data from Firestore.
interface AnalyticsContextData {
  loading: boolean;
  activeLeads: number;
  leadsLast24h: number; // This will now come from aggregated data if available, or be 0.
  totalConversions: number; // This will now come from aggregated data.
  funnelData: { stage: string; value: number; conversion: number }[];
  recentLeads: { id: string; sessionId: string; createdAt: Timestamp }[];
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
    leadsLast24h: 0, // Placeholder, will be updated
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
      console.warn("Firestore is not initialized. Real-time analytics will be disabled.");
      setAnalyticsData(prev => ({ ...prev, loading: false }));
      return;
    }

    // We now listen to a single document containing all live aggregated data.
    // This is much more efficient than querying the entire events collection.
    const liveDocRef = doc(firestore, "analytics_aggregates", "live");

    const unsubscribe = onSnapshot(liveDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as LiveAnalyticsData;

        // --- Process Funnel Data ---
        const { ageGateViews, vslViews, ctaClicks, purchases } = data.funnel || { ageGateViews: 0, vslViews: 0, ctaClicks: 0, purchases: 0};
        
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

        // --- Process other KPIs ---
        const activeLeadsCount = data.activeSessions ? Object.keys(data.activeSessions).length : 0;
        
        setAnalyticsData({
          loading: false,
          activeLeads: activeLeadsCount,
          leadsLast24h: vslViews, // Assuming the 'live' doc covers the last 24h for simplicity. A more complex system would be needed for a true sliding 24h window.
          totalConversions: purchases,
          funnelData,
          recentLeads: data.recentLeads || [],
          lastUpdatedAt: data.lastUpdatedAt ? data.lastUpdatedAt.toDate() : new Date(),
        });
      } else {
        // Document doesn't exist yet, probably because no events have been sent.
        console.log("Live analytics document not found. Waiting for first event.");
        setAnalyticsData(prev => ({ ...prev, loading: false }));
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
