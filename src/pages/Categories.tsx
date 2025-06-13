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
import { useTranslation } from 'react-i18next';
import { DailyAddressData, DailyAddressItem, convertToDailyAddressItem } from '@/types/category';

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
        distanceUnit={distanceUnit === 'km' ? 'km' : 'mi'}
        setDistanceUnit={(unit) => setDistanceUnit(unit === 'km' ? 'km' : 'mi')}
        transportMode={transportMode}
        setTransportMode={setTransportMode}
        onResetFilters={resetFilters}
      />
      
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
            <CategorySection 
              categories={convertedCategories}
              dailyAddresses={dailyAddresses.map(convertToDailyAddressItem)}
              onEditAddress={handleEditAddressWrapper}
              onDeleteAddress={handleDeleteAddress}
              onAddNewAddress={handleAddNewAddress}
              onSelectCategory={handleSelectCategory}
              selectedCategory={selectedCategory}
              transportMode={transportMode}
              maxDistance={maxDistance}
              maxDuration={maxDuration}
              distanceUnit={distanceUnit === 'km' ? 'km' : 'mi'}
              onSearchClick={handleSearchClick}
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
