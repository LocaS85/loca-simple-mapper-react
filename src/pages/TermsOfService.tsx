
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const TermsOfService = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`max-w-4xl mx-auto ${isMobile ? 'text-sm' : 'text-base'}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
        
        <p className="mb-4">Dernière mise à jour : 9 mai 2025</p>
        
        <div className="prose max-w-none">
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Introduction</h2>
          <p className="mb-4">
            Bienvenue sur LocaSimple (ci-après « le Service »). En utilisant notre application web ou mobile, vous acceptez d'être lié par les présentes Conditions Générales d'Utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser le Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Description du Service</h2>
          <p className="mb-4">
            LocaSimple est une application de géolocalisation permettant aux utilisateurs de rechercher et de localiser des points d'intérêt à proximité. Le Service propose également des fonctionnalités de filtrage par catégorie, distance et mode de transport.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Compte utilisateur</h2>
          <p className="mb-4">
            Pour accéder à certaines fonctionnalités du Service, vous devez créer un compte. Vous êtes responsable du maintien de la confidentialité de vos identifiants et de toutes les activités qui se produisent sous votre compte.
          </p>
          <p className="mb-4">
            Vous acceptez de fournir des informations exactes, à jour et complètes lors de la création de votre compte et de les mettre à jour si nécessaire. Nous nous réservons le droit de suspendre ou de résilier votre compte si nous constatons que les informations fournies sont inexactes, trompeuses ou incomplètes.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Utilisation du Service</h2>
          <p className="mb-4">
            Vous acceptez d'utiliser le Service conformément à toutes les lois applicables et aux présentes conditions. Vous ne devez pas :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Utiliser le Service d'une manière qui pourrait endommager, désactiver, surcharger ou compromettre les systèmes ou la sécurité de LocaSimple</li>
            <li>Tenter d'accéder à des parties du Service auxquelles vous n'êtes pas autorisé à accéder</li>
            <li>Utiliser des robots, des scrapers ou d'autres moyens automatisés pour accéder au Service</li>
            <li>Collecter ou récolter des données personnelles sur d'autres utilisateurs du Service</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Contenu de l'utilisateur</h2>
          <p className="mb-4">
            Notre Service peut vous permettre de publier, de lier, de stocker, de partager et de mettre à disposition certaines informations, textes, graphiques, vidéos ou autres contenus (« Contenu de l'utilisateur »). Vous êtes responsable de votre Contenu de l'utilisateur et de toutes les conséquences qui peuvent en découler.
          </p>
          <p className="mb-4">
            En publiant du Contenu de l'utilisateur sur ou via le Service, vous nous accordez une licence mondiale, non exclusive, gratuite, cessible et pouvant faire l'objet d'une sous-licence pour utiliser, reproduire, modifier, adapter, publier, traduire, distribuer, afficher publiquement et exécuter ce Contenu de l'utilisateur dans le cadre du Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Abonnements et paiements</h2>
          <p className="mb-4">
            Certaines fonctionnalités du Service sont proposées sur la base d'un abonnement payant. Si vous choisissez de souscrire à un abonnement payant, vous acceptez de payer tous les frais associés à l'abonnement choisi, aux tarifs en vigueur au moment de l'achat.
          </p>
          <p className="mb-4">
            Les abonnements se renouvellent automatiquement à moins que vous ne les annuliez avant la fin de la période en cours. Vous pouvez annuler votre abonnement à tout moment via les paramètres de votre compte.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Propriété intellectuelle</h2>
          <p className="mb-4">
            Le Service et son contenu original, ses fonctionnalités et sa conception sont et resteront la propriété exclusive de LocaSimple et de ses concédants. Le Service est protégé par le droit d'auteur, les marques commerciales et d'autres lois en France et à l'étranger.
          </p>
          <p className="mb-4">
            Nos marques et notre habillage commercial ne peuvent pas être utilisés en relation avec un produit ou un service sans notre consentement écrit préalable.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation de responsabilité</h2>
          <p className="mb-4">
            En aucun cas, LocaSimple, ses dirigeants, administrateurs, employés, partenaires ou agents ne seront responsables envers vous de tout dommage direct, indirect, accessoire, spécial, punitif ou consécutif découlant de votre accès ou de votre utilisation du Service.
          </p>
          <p className="mb-4">
            Nous ne garantissons pas que le Service sera disponible à tout moment ou lieu particulier, ni que le Service sera ininterrompu, sécurisé ou sans erreur.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Modifications des conditions</h2>
          <p className="mb-4">
            Nous nous réservons le droit de modifier ces Conditions à tout moment. Si nous le faisons, nous vous informerons en publiant les conditions modifiées sur cette page et en mettant à jour la date de « dernière mise à jour » en haut de ces Conditions.
          </p>
          <p className="mb-4">
            Il est de votre responsabilité de consulter régulièrement ces Conditions pour prendre connaissance des modifications. Votre utilisation continue du Service après la publication des Conditions modifiées constitue votre acceptation de ces modifications.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Loi applicable</h2>
          <p className="mb-4">
            Ces Conditions sont régies et interprétées conformément aux lois françaises, sans égard aux principes de conflits de lois. Tout litige découlant de ces Conditions sera soumis à la compétence exclusive des tribunaux de Paris, France.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">11. Contact</h2>
          <p className="mb-4">
            Si vous avez des questions concernant ces Conditions, veuillez nous contacter à l'adresse suivante : contact@locasimple.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
