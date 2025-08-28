import React from 'react';
import { Routes, Route } from "react-router-dom";
import GlobalLayout from '@/components/layout/GlobalLayout';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Categories from '@/pages/Categories';
import Search from '@/pages/Search';

import NotFound from '@/pages/NotFound';
import TermsOfService from '@/pages/TermsOfService';
import Privacy from '@/pages/Privacy';
import Premium from '@/pages/Premium';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Payment from '@/pages/Payment';
import Account from '@/pages/Account';
import Auth from '@/pages/Auth';
import ForgotPassword from '@/pages/ForgotPassword';
import Favorites from '@/pages/Favorites';
import FAQ from '@/pages/FAQ';
import Settings from '@/pages/Settings';
import Contact from '@/pages/Contact';

/**
 * Application routes configuration
 * All routes are defined here to provide a central place for route management
 */
export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<GlobalLayout><Index /></GlobalLayout>} />
      <Route path="/about" element={<GlobalLayout><About /></GlobalLayout>} />
      <Route path="/categories" element={<GlobalLayout><Categories /></GlobalLayout>} />
      <Route path="/recherche" element={<GlobalLayout><Search /></GlobalLayout>} />
      
      <Route path="/conditions" element={<GlobalLayout><TermsOfService /></GlobalLayout>} />
      <Route path="/confidentialite" element={<GlobalLayout><Privacy /></GlobalLayout>} />
      <Route path="/premium" element={<GlobalLayout><Premium /></GlobalLayout>} />
      <Route path="/auth" element={<GlobalLayout><Auth /></GlobalLayout>} />
      <Route path="/login" element={<GlobalLayout><Login /></GlobalLayout>} />
      <Route path="/register" element={<GlobalLayout><Register /></GlobalLayout>} />
      <Route path="/payment" element={<GlobalLayout><Payment /></GlobalLayout>} />
      <Route path="/account" element={<GlobalLayout><Account /></GlobalLayout>} />
      <Route path="/favorites" element={<GlobalLayout><Favorites /></GlobalLayout>} />
      <Route path="/settings" element={<GlobalLayout><Settings /></GlobalLayout>} />
      <Route path="/forgot-password" element={<GlobalLayout><ForgotPassword /></GlobalLayout>} />
      <Route path="/faq" element={<GlobalLayout><FAQ /></GlobalLayout>} />
      <Route path="/contact" element={<GlobalLayout><Contact /></GlobalLayout>} />
      <Route path="*" element={<GlobalLayout><NotFound /></GlobalLayout>} />
    </Routes>
  );
};

// Navigation structure for main application menus
export const navigationRoutes = [
  { path: '/', label: 'Accueil' },
  { path: '/categories', label: 'Catégories' },
  { path: '/recherche', label: 'Recherche' },
  
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
