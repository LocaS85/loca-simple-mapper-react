
import { navigationRoutes, footerRoutes, authRoutes } from '@/routes';

/**
 * Get the label for a route from the route path
 */
export const getRouteLabel = (path: string): string => {
  // Check all route collections to find the matching route
  const allRoutes = [...navigationRoutes, ...footerRoutes, ...authRoutes];
  const route = allRoutes.find(r => r.path === path);
  return route?.label || path;
};

/**
 * Get breadcrumb navigation items from a route path
 */
export const getBreadcrumbItems = (path: string): { label: string; path: string }[] => {
  const segments = path.split('/').filter(Boolean);
  
  // Always start with home
  const breadcrumbs: { label: string; path: string }[] = [
    { label: 'Accueil', path: '/' }
  ];
  
  // Build breadcrumb path progressively
  let currentPath = '';
  
  segments.forEach(segment => {
    currentPath += `/${segment}`;
    const label = getRouteLabel(currentPath) || segment;
    
    breadcrumbs.push({
      label,
      path: currentPath
    });
  });
  
  return breadcrumbs;
};
