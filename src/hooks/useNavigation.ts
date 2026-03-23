"use client";

import { useRouter as useNextRouter } from "next/navigation";
import { useParams as useNextParams } from "next/navigation";

/**
 * Wrapper hook that provides React Router-like useNavigate API using Next.js router
 * This allows page components to continue using navigate() without modification
 */
export function useNavigate() {
  const router = useNextRouter();

  return (path: string, options?: any) => {
    router.push(path);
  };
}

/**
 * Wrapper hook that provides React Router-like useParams API using Next.js params
 * Note: This requires the component to be wrapped properly with params
 */
export function useParams<
  T extends Record<string, any> = Record<string, string>,
>(): T {
  const params = useNextParams();
  return params as T;
}

/**
 * Get a Next.js router instance for more advanced routing needs
 */
export function useRouter() {
  return useNextRouter();
}
