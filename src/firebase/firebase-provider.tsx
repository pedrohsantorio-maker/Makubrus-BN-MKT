
"use client";

import React, { ReactNode } from 'react';

// This provider is now a simple wrapper to ensure Firebase is initialized.
// The actual data fetching and real-time logic has been moved to the
// /admin/dashboard page component for simplicity and clarity, as requested.
export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  // The initialization logic is in @/lib/firebase.ts and is executed
  // when imported anywhere, so this provider just needs to exist in the layout.
  return <>{children}</>;
};

// This custom hook is no longer needed as the logic is self-contained
// in the dashboard page. It can be removed or left for future use.
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
