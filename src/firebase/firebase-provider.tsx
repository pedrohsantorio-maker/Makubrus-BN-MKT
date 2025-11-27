
"use client";

import React, { ReactNode } from 'react';

// This provider is a simple wrapper. The actual Firebase initialization
// happens in @/lib/firebase.ts, which is configured with placeholders.
// This setup will cause errors until valid credentials are provided.
export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

// This custom hook is deprecated as the logic is now self-contained
// in the dashboard page.
export const useAnalytics = () => {
    console.warn("useAnalytics hook is deprecated. The logic has been moved to the dashboard page.");
    return {
        loading: true,
        activeLeads: 0,
        leadsLast24h: 0,
        totalConversions: 0,
        funnelData: [],
        recentLeads: [],
        lastUpdatedAt: null,
    };
};

    