
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
      { stage: "Visitas na Age Gate", value: 0, conversion: 100 },
      { stage: "Visualizaram VSL", value: 0, conversion: 0 },
      { stage: "Cliques no CTA (Vendas)", value: 0, conversion: 0 },
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

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const eventsQuery = query(
      collection(firestore, "events"),
      where("createdAt", ">", twentyFourHoursAgo)
    );

    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      const events = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
              name: data.name,
              sessionId: data.sessionId,
              createdAt: (data.createdAt as Timestamp)?.toDate(),
          };
      }).filter(e => e.createdAt); // Filter out events with no timestamp
      
      // Helper to get unique session IDs for a given event name or names
      const getUniqueSessionIds = (eventNames: string | string[]) => {
        const names = Array.isArray(eventNames) ? eventNames : [eventNames];
        const sessionIds = new Set<string>();
        events.forEach(e => {
            if (names.includes(e.name) && e.sessionId) {
                sessionIds.add(e.sessionId);
            }
        });
        return sessionIds;
      };

      // --- Calculate Active Leads (heartbeat in last 5 mins) ---
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const activeSessionIds = new Set<string>();
      events.forEach(e => {
        if (e.name === 'session_heartbeat' && e.createdAt > fiveMinutesAgo) {
          activeSessionIds.add(e.sessionId);
        }
      });

      // --- Calculate Funnel Data ---
      const funnelStep1_visits = getUniqueSessionIds('age_gate_view');
      const funnelStep2_vsl_views = getUniqueSessionIds('vsl_view');
      const funnelStep3_cta_clicks = getUniqueSessionIds(['main_cta_click', 'final_cta_click', 'vsl_page_cta']);
      
      const funnelData = [
        { 
          stage: "Visitas na Age Gate", 
          value: funnelStep1_visits.size, 
          conversion: 100 
        },
        { 
          stage: "Visualizaram VSL", 
          value: funnelStep2_vsl_views.size, 
          conversion: funnelStep1_visits.size > 0 ? (funnelStep2_vsl_views.size / funnelStep1_visits.size) * 100 : 0 
        },
        { 
          stage: "Conversões (CTA Vendas)", 
          value: funnelStep3_cta_clicks.size, 
          conversion: funnelStep2_vsl_views.size > 0 ? (funnelStep3_cta_clicks.size / funnelStep2_vsl_views.size) * 100 : 0 
        },
      ];
      
      // --- Calculate Main KPIs ---
      const leads24h = funnelStep2_vsl_views; // A lead is anyone who VIEWED THE VSL
      const totalConversions = getUniqueSessionIds('purchase'); // A real conversion is a purchase

      setAnalyticsData(prev => ({
        ...prev,
        activeLeads: activeSessionIds.size,
        leadsLast24h: leads24h.size,
        totalConversions: totalConversions.size,
        funnelData,
        loading: false,
        lastUpdatedAt: new Date(),
      }));
    }, (error) => {
        console.error("Error fetching real-time events:", error);
        setAnalyticsData(prev => ({ ...prev, loading: false }));
    });

    // --- Listener for Recent Leads Table ---
    const recentLeadsQuery = query(
      collection(firestore, "events"),
      where("name", "==", "vsl_view"),
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
        lastUpdatedAt: new Date()
      }));
    }, (error) => {
        console.error("Error fetching recent leads:", error);
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
