
import { Analytics } from '@vercel/analytics/react';
import { inject } from '@vercel/analytics';

// Configuration des événements analytics
export const trackEvent = (name: string, properties?: Record<string, any>) => {
  try {
    // Si on utilise Vercel Analytics
    if (typeof window !== 'undefined' && window.va) {
      window.va('track', name, properties);
    }
    
    // Log pour développement
    console.log('Analytics Event:', { name, properties });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Événements spécifiques à l'application
export const trackSearchEvent = (params: {
  category?: string;
  transport: string;
  distance: number;
  resultsCount: number;
}) => {
  trackEvent('search_performed', {
    category: params.category || 'all',
    transport_mode: params.transport,
    search_radius: params.distance,
    results_found: params.resultsCount
  });
};

export const trackFilterChange = (filterType: string, value: any) => {
  trackEvent('filter_changed', {
    filter_type: filterType,
    filter_value: value
  });
};

export const trackMapInteraction = (action: string, details?: any) => {
  trackEvent('map_interaction', {
    action,
    ...details
  });
};

export const trackCategorySelection = (categoryId: string, categoryName: string) => {
  trackEvent('category_selected', {
    category_id: categoryId,
    category_name: categoryName
  });
};

// Initialiser analytics
export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    inject();
  }
};
