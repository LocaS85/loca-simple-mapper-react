
export const getCategoryById = (id: string) => {
  // Simple utility to get category by ID
  const categories = [
    { id: 'restaurant', name: 'Restaurants' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'health', name: 'Santé' }
  ];
  
  return categories.find(cat => cat.id === id) || null;
};
