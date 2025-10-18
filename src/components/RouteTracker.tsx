'use client';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Component that tracks route changes and saves them to localStorage
 * This allows restoring the user's last visited route after reloading
 */
export default function RouteTracker() {
  const pathname = usePathname();
  const { isAuthenticated, saveCurrentRoute } = useAuth();

  useEffect(() => {
    // Only save protected routes (account, admin) when authenticated
    // Don't save root '/' or public routes
    if (pathname && isAuthenticated && !pathname.includes('/auth/')) {
      // Only save routes that we actually want to restore
      const isProtectedRoute =
        pathname.startsWith('/account') || pathname.startsWith('/admin');

      if (isProtectedRoute) {
        saveCurrentRoute(pathname);
      }
    }
  }, [pathname, isAuthenticated, saveCurrentRoute]);

  // This component doesn't render anything
  return null;
}
