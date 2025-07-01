
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isMapboxTokenValid } from '@/utils/mapboxConfig';
import { MapboxError } from '@/components/MapboxError';
import { 
  AddressFormDialog,
  CategoryMapView
} from '@/components/categories';
import CategoryCard from '@/components/categories/CategoryCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useAddressManagement } from '@/hooks/use-address-management';
import { useCategoryManagement } from '@/hooks/use-category-management';
import { useTranslation } from 'react-i18next';
import { DailyAddressData } from '@/types/category';
import { unifiedCategories } from '@/data/unifiedCategories';

const Categories = () => {
  // State for map toggle
  const [showMap, setShowMap] = useState(false);
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  
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
    distanceUnit,
    setDistanceUnit,
    handleFiltersChange,
    handleSelectCategory,
    setTransportMode,
    resetFilters
  } = useCategoryManagement();

  // Handle search from subcategory cards
  const handleSearchClick = (subcategoryId: string) => {
    // Navigate to search page with category and subcategory parameters
    const categoryId = selectedCategory?.id;
    if (categoryId) {
      const unit = distanceUnit === 'km' ? 'km' : 'mi';
      navigate(`/geosearch?category=${categoryId}&subcategory=${subcategoryId}&transport=${transportMode}&distance=${maxDistance}&unit=${unit}`);
    }
  };
  
  const handleEditAddressWrapper = (address: DailyAddressData) => {
    handleEditAddress(address);
  };
  
  // Check if Mapbox token is valid
  if (!isMapboxTokenValid()) {
    return <MapboxError />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Catégories</h1>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {showMap ? 'Liste' : 'Carte'}
          </button>
        </div>
      </div>
      
      {/* Loading indicator */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Main content - Map or List */}
          {showMap ? (
            <CategoryMapView 
              selectedCategory={selectedCategory?.id || ''}
              initialTransportMode={transportMode}
              initialMaxDistance={maxDistance}
              initialMaxDuration={maxDuration}
              initialAroundMeCount={aroundMeCount}
              initialShowMultiDirections={showMultiDirections}
              initialDistanceUnit={distanceUnit}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {unifiedCategories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  userLocation={dailyAddresses.length > 0 ? dailyAddresses[0]?.coordinates : null}
                  onCategorySelect={handleSelectCategory}
                  transportMode={transportMode}
                  maxDistance={maxDistance}
                  distanceUnit={distanceUnit === 'km' ? 'km' : 'mi'}
                  isLoading={isLoading}
                  showSubcategories={true}
                />
              ))}
            </div>
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
