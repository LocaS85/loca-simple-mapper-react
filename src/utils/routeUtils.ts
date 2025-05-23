
import { navigationRoutes, footerRoutes, authRoutes } from '@/routes';

/**
 * Get route object by path
 * @param path - Route path to search for
 * @returns Route object if found, undefined otherwise
 */
export const getRouteByPath = (path: string) => {
  const allRoutes = [...navigationRoutes, ...footerRoutes, ...authRoutes];
  return allRoutes.find(route => route.path === path);
};

/**
 * Get route label by path
 * @param path - Route path to search for
 * @returns Route label if found, path otherwise
 */
export const getRouteLabel = (path: string) => {
  const route = getRouteByPath(path);
  return route ? route.label : path;
};

/**
 * Check if route is active
 * @param currentPath - Current location path
 * @param routePath - Route path to check
 * @returns Boolean indicating if route is active
 */
export const isRouteActive = (currentPath: string, routePath: string) => {
  if (routePath === '/') {
    return currentPath === '/';
  }
  return currentPath.startsWith(routePath);
};
