'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LAST_ROUTE_KEY = 'lastVisitedRoute';
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/main',
  '/',
  '/category',
  '/product',
];

/**
 * Hook to manage route persistence and restoration
 * Saves the current route to localStorage and provides utilities for navigation
 */
export function useRouteGuard() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Save the current route if it's not a public/auth route
    if (pathname && !isPublicRoute(pathname)) {
      localStorage.setItem(LAST_ROUTE_KEY, pathname);
    }
  }, [pathname]);

  const isPublicRoute = (path: string) => {
    return PUBLIC_ROUTES.some(route => path.startsWith(route));
  };

  const getLastRoute = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(LAST_ROUTE_KEY);
  };

  const clearLastRoute = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(LAST_ROUTE_KEY);
  };

  const redirectToLastRoute = (fallback: string = '/main') => {
    const lastRoute = getLastRoute();
    if (lastRoute && !isPublicRoute(lastRoute)) {
      router.push(lastRoute);
    } else {
      router.push(fallback);
    }
  };

  return {
    getLastRoute,
    clearLastRoute,
    redirectToLastRoute,
    isPublicRoute,
  };
}
