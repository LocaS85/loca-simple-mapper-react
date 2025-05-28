
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Index from '@/pages/Index';
import About from '@/pages/About';
import Categories from '@/pages/Categories';
import GeoSearch from '@/pages/GeoSearch';
import NotFound from '@/pages/NotFound';
import TermsOfService from '@/pages/TermsOfService';
import Privacy from '@/pages/Privacy';
import Premium from '@/pages/Premium';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Payment from '@/pages/Payment';
import ModernGeoSearch from '@/pages/ModernGeoSearch';
import Account from '@/pages/Account';
import ForgotPassword from '@/pages/ForgotPassword';
import Favorites from '@/pages/Favorites';
import FAQ from '@/pages/FAQ';

/**
 * Application routes configuration
 * All routes are defined here to provide a central place for route management
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/about" element={<About />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/geosearch" element={<GeoSearch />} />
      <Route path="/conditions" element={<TermsOfService />} />
      <Route path="/confidentialite" element={<Privacy />} />
      <Route path="/premium" element={<Premium />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/modern-search" element={<ModernGeoSearch />} />
      <Route path="/account" element={<Account />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Navigation structure for main application menus
export const navigationRoutes = [
  { path: '/', label: 'Accueil' },
  { path: '/categories', label: 'Catégories' },
  { path: '/geosearch', label: 'Recherche Géographique' },
  { path: '/modern-search', label: 'Recherche Moderne' },
  { path: '/about', label: 'À Propos' },
];

// Footer navigation links
export const footerRoutes = [
  { path: '/conditions', label: 'Conditions Générales' },
  { path: '/confidentialite', label: 'Politique de Confidentialité' },
  { path: '/about', label: 'À Propos' },
  { path: '/faq', label: 'FAQ' },
];

// Authentication routes
export const authRoutes = [
  { path: '/login', label: 'Connexion' },
  { path: '/register', label: 'Inscription' },
  { path: '/account', label: 'Mon Compte' },
];

export default AppRoutes;
