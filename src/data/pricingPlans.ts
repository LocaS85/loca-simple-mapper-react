export interface PricingPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyDisplayPrice: string;
  annualDisplayPrice: string;
  popular: boolean;
  features: string[];
  description: string;
  savings: string;
  planType: 'free' | 'essential' | 'pro';
  icon: string;
  color: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratuit',
    monthlyPrice: 0,
    annualPrice: 0,
    monthlyDisplayPrice: '0€',
    annualDisplayPrice: '0€',
    popular: false,
    features: [
      '10 recherches par jour',
      'Cartes de base',
      'Fonctionnalités limitées',
      'Support communautaire'
    ],
    description: 'Pour découvrir LocaSimple',
    savings: '',
    planType: 'free',
    icon: 'MapPin',
    color: 'border-gray-200'
  },
  {
    id: 'essential',
    name: 'Essentiel',
    monthlyPrice: 4.99,
    annualPrice: 49.99,
    monthlyDisplayPrice: '4,99€',
    annualDisplayPrice: '49,99€',
    popular: true,
    features: [
      'Recherches illimitées',
      'Cartes premium',
      'Export PDF',
      'Sans publicité',
      'Support prioritaire'
    ],
    description: 'Parfait pour un usage personnel',
    savings: '17% d\'économie',
    planType: 'essential',
    icon: 'Zap',
    color: 'border-blue-200'
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 9.99,
    annualPrice: 99.99,
    monthlyDisplayPrice: '9,99€',
    annualDisplayPrice: '99,99€',
    popular: false,
    features: [
      'Tout de l\'Essentiel',
      'API accès',
      'Analytics avancées',
      'Support dédié 24/7',
      'Intégrations personnalisées'
    ],
    description: 'Pour les professionnels et entreprises',
    savings: '17% d\'économie',
    planType: 'pro',
    icon: 'Crown',
    color: 'border-purple-200'
  }
];

export const getPlanById = (id: string): PricingPlan | undefined => {
  return pricingPlans.find(plan => plan.id === id);
};

export const getPlanPrice = (planId: string, billing: 'monthly' | 'annual'): number => {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  return billing === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
};

export const getDisplayPrice = (planId: string, billing: 'monthly' | 'annual'): string => {
  const plan = getPlanById(planId);
  if (!plan) return '0€';
  return billing === 'monthly' ? plan.monthlyDisplayPrice : plan.annualDisplayPrice;
};

export const getSavingsAmount = (planId: string): number => {
  const plan = getPlanById(planId);
  if (!plan) return 0;
  return (plan.monthlyPrice * 12) - plan.annualPrice;
};