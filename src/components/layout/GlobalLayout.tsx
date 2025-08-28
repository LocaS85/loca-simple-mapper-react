
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface GlobalLayoutProps {
  children: React.ReactNode;
}

const GlobalLayout: React.FC<GlobalLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Pages qui ne doivent pas afficher le header/footer
  const hideHeaderFooterPaths = ['/geosearch', '/recherche'];
  const shouldHideHeaderFooter = hideHeaderFooterPaths.includes(location.pathname);

  if (shouldHideHeaderFooter) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4">
        <Header />
      </div>
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default GlobalLayout;
