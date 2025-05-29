
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = "LocaSimple - Trouvez facilement les lieux autour de vous",
  description = "Application de cartographie française pour découvrir restaurants, services et points d'intérêt près de chez vous. Recherche avancée, filtres intelligents, cartes interactives.",
  keywords = "cartographie, france, restaurants, services, lieux, carte interactive, géolocalisation, recherche locale",
  ogImage = "https://locasimple.fr/og-image.jpg",
  canonical
}) => {
  const location = useLocation();
  const currentUrl = `https://locasimple.fr${location.pathname}`;
  const canonicalUrl = canonical || currentUrl;

  useEffect(() => {
    // Titre de la page
    document.title = title;

    // Métadonnées de base
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('name', 'author', 'LocaSimple');
    updateMetaTag('name', 'viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('name', 'robots', 'index, follow');

    // Open Graph
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:locale', 'fr_FR');
    updateMetaTag('property', 'og:site_name', 'LocaSimple');

    // Twitter Card
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);

    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // JSON-LD Schema - Corriger l'erreur TypeScript
    let jsonLdScript = document.querySelector('#json-ld') as HTMLScriptElement;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement('script');
      jsonLdScript.id = 'json-ld';
      jsonLdScript.type = 'application/ld+json';
      document.head.appendChild(jsonLdScript);
    }
    
    jsonLdScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "LocaSimple",
      "description": description,
      "url": "https://locasimple.fr",
      "applicationCategory": "MapApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "EUR"
      },
      "creator": {
        "@type": "Organization",
        "name": "LocaSimple"
      }
    });

  }, [title, description, keywords, ogImage, currentUrl, canonicalUrl]);

  const updateMetaTag = (attribute: string, value: string, content: string) => {
    let tag = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement;
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, value);
      document.head.appendChild(tag);
    }
    tag.content = content;
  };

  return null;
};

export default SEOHead;
