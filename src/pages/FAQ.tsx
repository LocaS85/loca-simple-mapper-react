
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// FAQ Categories
type FAQCategory = {
  id: string;
  title: string;
  faqs: {
    question: string;
    answer: string;
  }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "general",
    title: "Questions générales",
    faqs: [
      {
        question: "Comment fonctionne LocaSimple?",
        answer: "LocaSimple est une application de géolocalisation qui vous permet de trouver facilement des lieux d'intérêt autour de vous. Il vous suffit de saisir votre recherche, de définir vos filtres, et l'application vous affiche les résultats sur une carte interactive."
      },
      {
        question: "Est-ce que l'application est gratuite?",
        answer: "Oui, l'application de base est gratuite. Nous proposons également des fonctionnalités premium via un abonnement mensuel qui offre des options avancées comme l'historique illimité et l'absence de publicités."
      },
      {
        question: "Sur quels appareils puis-je utiliser LocaSimple?",
        answer: "LocaSimple est accessible sur tous les navigateurs web modernes, sur ordinateur comme sur mobile. Notre interface s'adapte automatiquement à la taille de votre écran."
      }
    ]
  },
  {
    id: "account",
    title: "Compte utilisateur",
    faqs: [
      {
        question: "Comment créer un compte?",
        answer: "Cliquez sur le bouton 'S'inscrire' dans le menu principal, puis remplissez le formulaire avec vos informations personnelles. Confirmez votre adresse email via le lien que vous recevrez, et votre compte sera activé."
      },
      {
        question: "J'ai oublié mon mot de passe, que faire?",
        answer: "Sur la page de connexion, cliquez sur 'Mot de passe oublié?' et suivez les instructions pour réinitialiser votre mot de passe via votre adresse email."
      },
      {
        question: "Comment supprimer mon compte?",
        answer: "Connectez-vous à votre compte, accédez à la page 'Mon Compte', puis cliquez sur 'Paramètres avancés' et enfin sur 'Supprimer mon compte'. Confirmez la suppression et votre compte sera définitivement supprimé."
      }
    ]
  },
  {
    id: "technical",
    title: "Support technique",
    faqs: [
      {
        question: "L'application ne détecte pas ma position, que faire?",
        answer: "Vérifiez que vous avez accordé les permissions de géolocalisation à votre navigateur. Si le problème persiste, essayez d'actualiser la page ou de redémarrer votre navigateur."
      },
      {
        question: "Comment signaler un bug?",
        answer: "Utilisez notre formulaire de contact accessible depuis le menu principal en précisant 'Signalement de bug' dans l'objet. Décrivez le problème rencontré et, si possible, joignez une capture d'écran."
      }
    ]
  },
  {
    id: "payment",
    title: "Paiement et abonnement",
    faqs: [
      {
        question: "Quels moyens de paiement acceptez-vous?",
        answer: "Nous acceptons les cartes bancaires (Visa, Mastercard) ainsi que les paiements via PayPal et Apple Pay pour les appareils iOS."
      },
      {
        question: "Comment annuler mon abonnement premium?",
        answer: "Rendez-vous dans la section 'Mon Compte', puis 'Abonnements'. Cliquez sur 'Gérer mon abonnement' et suivez les instructions pour l'annuler. Votre abonnement restera actif jusqu'à la fin de la période en cours."
      }
    ]
  }
];

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState<string>("general");
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Questions fréquemment posées</h1>
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row gap-8'}`}>
        {/* Categories sidebar */}
        <div className={`${isMobile ? 'mb-6' : 'w-1/4'}`}>
          <h2 className="text-lg font-semibold mb-3">Catégories</h2>
          <div className={`${isMobile ? 'flex flex-wrap gap-2' : 'flex flex-col gap-2'}`}>
            {faqCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-md ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                } transition-colors ${isMobile ? 'text-sm' : 'text-base'}`}
              >
                {category.title}
              </button>
            ))}
          </div>
        </div>
        
        {/* FAQ content */}
        <div className={`${isMobile ? 'w-full' : 'w-3/4'}`}>
          <h2 className="text-xl font-semibold mb-4">
            {faqCategories.find(cat => cat.id === activeCategory)?.title || "Questions fréquentes"}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqCategories
              .find(cat => cat.id === activeCategory)
              ?.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
