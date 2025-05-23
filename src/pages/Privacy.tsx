
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import BoutonRetour from '@/components/ui/BoutonRetour';

const Privacy = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="fixed top-4 left-4 z-10">
        <BoutonRetour route="/"/>
      </div>
      
      <div className={`max-w-4xl mx-auto ${isMobile ? 'text-sm pt-12' : 'text-base pt-4'}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Politique de Confidentialité</h1>
        
        <p className="mb-4">Dernière mise à jour : 19 mai 2025</p>
        
        <div className="prose max-w-none">
          <p className="mb-4">
            La présente Politique de Confidentialité décrit comment LocaSimple collecte, utilise et partage vos informations personnelles lorsque vous utilisez notre application web ou mobile.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Informations que nous collectons</h2>
          <h3 className="text-lg font-medium mt-4 mb-2">1.1 Informations que vous nous fournissez</h3>
          <p className="mb-4">
            Lorsque vous créez un compte, nous collectons les informations que vous nous fournissez directement, telles que votre nom, adresse e-mail, numéro de téléphone et mot de passe.
          </p>
          <p className="mb-4">
            Si vous optez pour un abonnement premium, nous collectons également vos informations de paiement, qui sont traitées par nos prestataires de services de paiement sécurisés.
          </p>
          <p className="mb-4">
            Lorsque vous ajoutez des adresses favorites ou enregistrez des recherches, nous collectons ces informations afin de vous fournir une expérience personnalisée.
          </p>
          
          <h3 className="text-lg font-medium mt-4 mb-2">1.2 Informations collectées automatiquement</h3>
          <p className="mb-4">
            Lorsque vous utilisez notre Service, nous collectons automatiquement certaines informations, notamment :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Informations de géolocalisation (si vous avez donné votre consentement)</li>
            <li>Informations sur votre appareil (type d'appareil, système d'exploitation, identifiants uniques)</li>
            <li>Données de journalisation (adresse IP, date et heure d'accès, pages visitées)</li>
            <li>Informations sur vos recherches et interactions avec le Service</li>
            <li>Données de navigation (durée de session, pages consultées, fonctionnalités utilisées)</li>
            <li>Préférences de recherche et filtres fréquemment utilisés</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Comment nous utilisons vos informations</h2>
          <p className="mb-4">
            Nous utilisons les informations que nous collectons pour :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Fournir et améliorer notre Service</li>
            <li>Vous montrer des lieux pertinents à proximité de votre position</li>
            <li>Personnaliser votre expérience et vous fournir des recommandations</li>
            <li>Communiquer avec vous concernant votre compte, nos mises à jour ou nos offres</li>
            <li>Détecter, prévenir et résoudre les problèmes techniques ou de sécurité</li>
            <li>Gérer votre abonnement et traiter vos paiements</li>
            <li>Analyser l'utilisation du Service afin de l'améliorer</li>
            <li>Développer de nouvelles fonctionnalités basées sur les comportements des utilisateurs</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Partage de vos informations</h2>
          <p className="mb-4">
            Nous ne vendons pas vos données personnelles. Cependant, nous pouvons partager vos informations dans les circonstances suivantes :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Avec des prestataires de services tiers qui nous aident à exploiter notre Service (par exemple, services d'hébergement, analyse de données)</li>
            <li>Pour nous conformer à une obligation légale</li>
            <li>Pour protéger les droits, la propriété ou la sécurité de LocaSimple, de nos utilisateurs ou du public</li>
            <li>Dans le cadre d'une transaction commerciale (fusion, acquisition, vente d'actifs)</li>
            <li>Avec votre consentement</li>
            <li>Avec nos partenaires commerciaux pour améliorer les services proposés (uniquement avec votre consentement explicite)</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Stockage et sécurité des données</h2>
          <p className="mb-4">
            Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir le Service et remplir les finalités décrites dans cette Politique de Confidentialité, sauf si une période de conservation plus longue est requise ou permise par la loi.
          </p>
          <p className="mb-4">
            Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'utilisation abusive, l'accès non autorisé, la divulgation ou la modification.
          </p>
          <p className="mb-4">
            Nos serveurs sont situés dans l'Union européenne et respectent les normes strictes du RGPD. Nous effectuons régulièrement des sauvegardes et des audits de sécurité pour garantir la protection de vos données.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Vos droits</h2>
          <p className="mb-4">
            En vertu du Règlement Général sur la Protection des Données (RGPD) et d'autres lois applicables en matière de protection des données, vous disposez des droits suivants concernant vos données personnelles :
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Le droit d'accéder à vos données personnelles</li>
            <li>Le droit de rectifier vos données personnelles</li>
            <li>Le droit de supprimer vos données personnelles</li>
            <li>Le droit de restreindre le traitement de vos données personnelles</li>
            <li>Le droit à la portabilité des données</li>
            <li>Le droit de vous opposer au traitement de vos données personnelles</li>
            <li>Le droit de retirer votre consentement</li>
            <li>Le droit de ne pas faire l'objet d'une décision fondée exclusivement sur un traitement automatisé</li>
          </ul>
          <p className="mb-4">
            Pour exercer ces droits, veuillez nous contacter à l'adresse indiquée à la fin de cette Politique de Confidentialité.
          </p>
          <p className="mb-4">
            Vous avez également le droit d'introduire une réclamation auprès d'une autorité de contrôle, comme la Commission Nationale de l'Informatique et des Libertés (CNIL) en France.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Cookies et technologies similaires</h2>
          <p className="mb-4">
            Nous utilisons des cookies et des technologies similaires pour collecter des informations sur votre activité, votre navigateur et votre appareil. Ces technologies nous aident à mémoriser vos préférences, à comprendre comment vous utilisez notre Service et à personnaliser nos communications marketing.
          </p>
          <p className="mb-4">
            Vous pouvez gérer vos préférences en matière de cookies via les paramètres de votre navigateur. Toutefois, le blocage de certains cookies peut affecter votre expérience sur notre Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Transferts internationaux de données</h2>
          <p className="mb-4">
            Vos données personnelles peuvent être transférées et traitées dans des pays autres que celui dans lequel vous résidez. Ces pays peuvent avoir des lois sur la protection des données différentes de celles de votre pays.
          </p>
          <p className="mb-4">
            Lorsque nous transférons vos données personnelles à l'extérieur de l'EEE, nous nous assurons qu'un niveau de protection adéquat est mis en place, soit par l'utilisation de clauses contractuelles types approuvées par la Commission européenne, soit par d'autres mécanismes de transfert appropriés.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">8. Protection des données des enfants</h2>
          <p className="mb-4">
            Notre Service n'est pas destiné aux personnes de moins de 15 ans et nous ne collectons pas sciemment des données personnelles d'enfants de moins de 15 ans. Si nous apprenons que nous avons collecté des données personnelles d'un enfant de moins de 15 ans sans avoir obtenu le consentement parental, nous prendrons des mesures pour supprimer ces informations de nos serveurs.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">9. Modifications de cette politique</h2>
          <p className="mb-4">
            Nous pouvons mettre à jour notre Politique de Confidentialité de temps à autre. Nous vous informerons de tout changement en publiant la nouvelle Politique de Confidentialité sur cette page et en mettant à jour la date de « dernière mise à jour » en haut de cette Politique.
          </p>
          <p className="mb-4">
            Nous vous encourageons à consulter régulièrement cette Politique de Confidentialité pour rester informé de la façon dont nous protégeons vos informations.
          </p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">10. Contact</h2>
          <p className="mb-4">
            Si vous avez des questions ou des préoccupations concernant cette Politique de Confidentialité ou nos pratiques en matière de données, veuillez nous contacter à :
          </p>
          <p className="mb-4">
            Email : confidentialite@locasimple.fr<br />
            Délégué à la protection des données : dpo@locasimple.fr<br />
            Adresse postale : 123 Avenue des Champs-Élysées, 75008 Paris, France
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
