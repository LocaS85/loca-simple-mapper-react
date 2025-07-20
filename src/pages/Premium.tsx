import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { pricingPlans } from '@/data/pricingPlans';

const Premium = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  const handleSubscribe = (planId: string, billing: 'monthly' | 'annual') => {
    if (planId === 'free') {
      navigate('/geosearch');
    } else {
      const planType = `${planId}-${billing}`;
      navigate(`/payment?plan=${planType}`);
    }
  };

  const getDisplayPrice = (plan: any, billing: 'monthly' | 'annual') => {
    return billing === 'monthly' ? plan.monthlyDisplayPrice : plan.annualDisplayPrice;
  };

  const getPeriodText = (billing: 'monthly' | 'annual') => {
    return billing === 'monthly' ? 'par mois' : 'par an';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-6">
              🚀 Offre de lancement - Jusqu'à 33% de réduction
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Passez à LocaSimple Premium
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez toute la puissance de LocaSimple avec nos plans premium et accédez à des fonctionnalités exclusives pour une expérience optimale.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  billingCycle === 'annual'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Annuel
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Économisez 17%
                </span>
              </button>
            </div>
          </div>
          
          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.color} transition-all hover:scale-105 ${plan.popular ? 'lg:scale-110' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    ⭐ Plus populaire
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-4xl md:text-5xl font-bold text-gray-900">
                        {getDisplayPrice(plan, billingCycle)}
                      </span>
                      <div className="text-left">
                        <div className="text-sm text-gray-600">{getPeriodText(billingCycle)}</div>
                      </div>
                    </div>
                    {billingCycle === 'annual' && plan.savings && (
                      <CardDescription className="text-green-600 font-semibold mt-2 text-lg">
                        {plan.savings}
                      </CardDescription>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="px-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 shrink-0 mt-1" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button 
                    className={`w-full py-3 text-lg font-semibold ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.id, billingCycle)}
                  >
                    {plan.id === 'free' ? 'Commencer gratuitement' : 
                     plan.popular ? 'Commencer maintenant' : 'Choisir ce plan'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* FAQ Section */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-sm mb-12">
            <h2 className="text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">🎯 Comment fonctionne la période d'essai ?</h3>
                  <p className="text-gray-600">Nous offrons 14 jours d'essai gratuit pour tous nos nouveaux utilisateurs. Aucune carte requise, annulation possible à tout moment.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">🔄 Puis-je changer de forfait ?</h3>
                  <p className="text-gray-600">Oui, changement possible à tout moment. Passage immédiat vers un plan supérieur, différé vers un plan inférieur.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">❌ Comment annuler mon abonnement ?</h3>
                  <p className="text-gray-600">Annulation simple depuis votre compte utilisateur. Accès maintenu jusqu'à la fin de votre période payée.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">🏢 Remises pour les entreprises ?</h3>
                  <p className="text-gray-600">Forfaits spéciaux entreprises disponibles. Contactez notre équipe commerciale pour un devis personnalisé.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="text-center p-8 lg:p-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Prêt à commencer ?</h2>
            <p className="text-xl mb-8 opacity-90">Rejoignez plus de 10,000 utilisateurs qui font confiance à LocaSimple</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Essai gratuit 14 jours
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                Voir une démo
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Premium;
