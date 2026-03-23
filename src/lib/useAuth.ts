"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useCallback } from "react";

/**
 * Custom hook to get auth user info from NextAuth session
 * Returns: { user, isAuthenticated, isAdmin, status, error }
 */
export function useAuthUser() {
  const { data: session, status } = useSession();

  return {
    user: session?.user || null,
    isAuthenticated: status === "authenticated",
    isAdmin: session?.user?.role === "admin",
    status: status as "authenticated" | "unauthenticated" | "loading",
    error: null,
  };
}

/**
 * Custom hook to sign out user
 * Returns: signOut function
 */
export function useSignOut() {
  return useCallback(async () => {
    await nextAuthSignOut({ redirect: false });
  }, []);
}
