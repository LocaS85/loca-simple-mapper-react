
// Service d'analytics simple pour éviter les erreurs
export const trackFilterChange = (key: string, value: any) => {
  console.log('Analytics - Filter change:', key, value);
};

export const trackSearchEvent = (query: string) => {
  console.log('Analytics - Search event:', query);
};
