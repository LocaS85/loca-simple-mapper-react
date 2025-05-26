
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Premium = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const plans = [
    {
      name: "Mensuel",
      price: "9,99€",
      period: "par mois",
      planType: "monthly",
      features: [
        "Recherche illimitée",
        "Accès aux cartes détaillées",
        "Recherche avancée par filtres",
        "Exportation PDF des résultats",
        "Sans publicité"
      ],
      popular: false
    },
    {
      name: "Annuel",
      price: "89,99€",
      period: "par an",
      planType: "annual",
      features: [
        "Recherche illimitée",
        "Accès aux cartes détaillées",
        "Recherche avancée par filtres",
        "Exportation PDF des résultats",
        "Sans publicité",
        "Historique des recherches illimité",
        "Accès prioritaire aux nouvelles fonctionnalités"
      ],
      popular: true,
      saving: "25% d'économie"
    },
    {
      name: "Famille",
      price: "149,99€",
      period: "par an",
      planType: "family",
      features: [
        "Jusqu'à 5 utilisateurs",
        "Recherche illimitée",
        "Accès aux cartes détaillées",
        "Recherche avancée par filtres",
        "Exportation PDF des résultats",
        "Sans publicité",
        "Historique des recherches illimité",
        "Accès prioritaire aux nouvelles fonctionnalités",
        "Support client prioritaire"
      ],
      popular: false
    }
  ];

  const handleSubscribe = (planType: string) => {
    navigate(`/payment?plan=${planType}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Passez à LocaSimple Premium</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez toute la puissance de LocaSimple avec notre abonnement premium et accédez à des fonctionnalités exclusives pour une expérience optimale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Plus populaire
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="mt-3">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-500 ml-1">{plan.period}</span>
                  </div>
                  {plan.saving && (
                    <CardDescription className="text-green-600 font-medium mt-1">
                      {plan.saving}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.planType)}
                  >
                    S'abonner
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-12">
            <h2 className="text-xl font-semibold mb-4">Questions fréquentes</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Comment fonctionne la période d'essai ?</h3>
                <p className="text-gray-600">Nous offrons une période d'essai de 14 jours pour tous nos nouveaux utilisateurs. Vous pouvez annuler à tout moment pendant cette période sans être facturé.</p>
              </div>
              <div>
                <h3 className="font-medium">Puis-je changer de forfait ?</h3>
                <p className="text-gray-600">Oui, vous pouvez changer de forfait à tout moment. Si vous passez à un forfait supérieur, la différence sera calculée au prorata. Si vous passez à un forfait inférieur, le changement prendra effet à la fin de votre période de facturation actuelle.</p>
              </div>
              <div>
                <h3 className="font-medium">Comment puis-je annuler mon abonnement ?</h3>
                <p className="text-gray-600">Vous pouvez annuler votre abonnement à tout moment depuis votre compte utilisateur. L'annulation prendra effet à la fin de votre période de facturation en cours.</p>
              </div>
              <div>
                <h3 className="font-medium">Y a-t-il des remises pour les entreprises ?</h3>
                <p className="text-gray-600">Oui, nous proposons des forfaits spéciaux pour les entreprises. Contactez notre équipe commerciale pour plus d'informations.</p>
              </div>
            </div>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Toujours pas convaincu ?</h2>
            <p className="mb-6">Essayez LocaSimple Premium gratuitement pendant 14 jours</p>
            <Button size="lg">Commencer l'essai gratuit</Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Premium;
