
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();
  
  // Pages qui ne doivent pas afficher le header/footer
  const hideHeaderFooterPaths = ['/geosearch'];
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

export default AppLayout;
