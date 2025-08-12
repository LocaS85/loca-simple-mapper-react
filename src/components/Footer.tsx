
import React from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from 'react-i18next';
import { translationService } from '@/services/translationService';
import Logo from '@/components/ui/Logo';

const Footer = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className={`${isMobile ? 'space-y-8' : 'grid grid-cols-3 gap-8'}`}>
          {/* Description sans logo */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">LocaSimple</h3>
            <p className="text-sm text-gray-600">
              {translationService.get('footer.description', {
                fallback: 'La solution de géolocalisation intelligente pour tous vos besoins'
              })}
            </p>
          </div>
          
          {/* Navigation Links - Col 1 */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t('footer.navigation')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600">
                  {t('header.home')}
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 hover:text-blue-600">
                  {t('header.categories')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600">
                  {t('header.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Navigation Links - Col 2 */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t('footer.account')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/auth" className="text-gray-600 hover:text-blue-600">
                  Se connecter
                </Link>
              </li>
               <li>
                <Link to="/account" className="text-gray-600 hover:text-blue-600">
                  Mon compte
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-gray-600 hover:text-blue-600">
                  {t('footer.favorites')}
                </Link>
              </li>
              <li>
                <Link to="/saved" className="text-gray-600 hover:text-blue-600">
                  {t('footer.savedSearches')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Navigation Links - Col 3 */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t('footer.information')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-600">
                  {t('footer.faq')}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-600 hover:text-blue-600">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link to="/payment" className="text-gray-600 hover:text-blue-600">
                  {t('footer.premium')}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={`border-t border-gray-200 pt-6 mt-8 ${isMobile ? 'text-center' : 'flex justify-center'}`}>
          <p className="text-sm text-gray-500">
            © 2024 LS - Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
