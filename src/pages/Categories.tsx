
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import { 
  AddressFormDialog,
  CategoryMapView,
  CategorySection
} from '@/components/categories';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import CategoryPageHeader from '@/components/categories/CategoryPageHeader';
import { useAddressManagement } from '@/hooks/use-address-management';
import { useCategoryManagement } from '@/hooks/use-category-management';

const Categories = () => {
  // State for map toggle
  const [showMap, setShowMap] = useState(false);
  
  const navigate = useNavigate();
  
  // Use custom hooks for state management
  const {
    dailyAddresses,
    showAddressForm,
    setShowAddressForm,
    editingAddress,
    setEditingAddress,
    handleSaveAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleAddNewAddress
  } = useAddressManagement();
  
  const {
    convertedCategories,
    selectedCategory,
    isLoading,
    transportMode,
    maxDistance,
    setMaxDistance,
    maxDuration,
    setMaxDuration,
    aroundMeCount,
    setAroundMeCount,
    showMultiDirections,
    setShowMultiDirections,
    handleFiltersChange,
    handleSelectCategory
  } = useCategoryManagement();

  // Handle search from subcategory cards
  const handleSearchClick = (subcategoryId: string) => {
    // Navigate to search page with category and subcategory parameters
    const categoryId = selectedCategory?.id;
    if (categoryId) {
      navigate(`/search?category=${categoryId}&subcategory=${subcategoryId}&transport=${transportMode}&distance=${maxDistance}`);
    }
  };
  
  // Check if Mapbox token is valid
  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header with list/map toggle */}
      <CategoryPageHeader 
        showMap={showMap}
        setShowMap={setShowMap}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        maxDuration={maxDuration}
        setMaxDuration={setMaxDuration}
        aroundMeCount={aroundMeCount}
        setAroundMeCount={setAroundMeCount}
        showMultiDirections={showMultiDirections}
        setShowMultiDirections={setShowMultiDirections}
      />
      
      {/* Loading indicator */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Main content - Map or List */}
          {showMap ? (
            <CategoryMapView 
              onFiltersChange={handleFiltersChange}
              selectedCategory={selectedCategory}
              initialTransportMode={transportMode}
              initialMaxDistance={maxDistance}
              initialMaxDuration={maxDuration}
              initialAroundMeCount={aroundMeCount}
              initialShowMultiDirections={showMultiDirections}
            />
          ) : (
            <CategorySection 
              categories={convertedCategories}
              dailyAddresses={dailyAddresses}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
              onAddNewAddress={handleAddNewAddress}
              onSelectCategory={handleSelectCategory}
              selectedCategory={selectedCategory}
              transportMode={transportMode}
              maxDistance={maxDistance}
              maxDuration={maxDuration}
            />
          )}
        </>
      )}
      
      {/* Address form dialog */}
      <AddressFormDialog 
        showAddressForm={showAddressForm}
        setShowAddressForm={setShowAddressForm}
        editingAddress={editingAddress}
        setEditingAddress={setEditingAddress}
        onSaveAddress={handleSaveAddress}
      />
    </div>
  );
};

export default Categories;
