"use client";

// This is a mock for Firebase Analytics.
// In a real application, you would initialize Firebase and use the real analytics library.
export const logEvent = (eventName: string, params?: { [key: string]: any }) => {
  console.log(`[Firebase Analytics] Event: ${eventName}`, params);
};
