
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckIcon } from 'lucide-react';

type PlanType = 'monthly' | 'annual';
type CardBrand = 'visa' | 'mastercard' | 'amex' | '';

const Payment = () => {
  const isMobile = useIsMobile();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [cardNumber, setCardNumber] = useState('');
  const [cardBrand, setCardBrand] = useState<CardBrand>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // Format card number with spaces (e.g., 4242 4242 4242 4242)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
      // Detect card type based on first digit(s)
      if (value[0] === '4') {
        setCardBrand('visa');
      } else if (/^5[1-5]/.test(value)) {
        setCardBrand('mastercard');
      } else if (/^3[47]/.test(value)) {
        setCardBrand('amex');
      } else {
        setCardBrand('');
      }
    } else {
      setCardBrand('');
    }
    
    // Format with spaces
    if (value.length > 16) value = value.slice(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  // Format expiry date as MM/YY
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiryDate(value);
  };

  // Limit CVV to 3-4 digits
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Payment processing logic would go here
    alert('Paiement traité avec succès!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Abonnement Premium</h1>
      
      <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-3 gap-6'}`}>
        {/* Plan Selection */}
        <div className={`${isMobile ? '' : 'col-span-1'}`}>
          <Card>
            <CardHeader>
              <CardTitle>Choisissez votre formule</CardTitle>
              <CardDescription>Débloquez toutes les fonctionnalités premium</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className={`p-4 rounded-lg cursor-pointer border-2 ${
                  selectedPlan === 'monthly' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPlan('monthly')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Mensuel</h3>
                    <p className="text-sm text-gray-500">Facturé mensuellement</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">9,99€</div>
                    <div className="text-xs text-gray-500">/mois</div>
                  </div>
                </div>
                {selectedPlan === 'monthly' && (
                  <div className="mt-2 text-blue-600 flex items-center">
                    <CheckIcon size={16} className="mr-1" />
                    <span className="text-xs">Sélectionné</span>
                  </div>
                )}
              </div>
              
              <div 
                className={`p-4 rounded-lg cursor-pointer border-2 ${
                  selectedPlan === 'annual' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setSelectedPlan('annual')}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Annuel</h3>
                    <p className="text-sm text-gray-500">Facturé annuellement</p>
                    <p className="text-xs text-green-600 font-medium mt-1">Économisez 20%</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-xl">95,88€</div>
                    <div className="text-xs text-gray-500">7,99€/mois</div>
                  </div>
                </div>
                {selectedPlan === 'annual' && (
                  <div className="mt-2 text-blue-600 flex items-center">
                    <CheckIcon size={16} className="mr-1" />
                    <span className="text-xs">Sélectionné</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 text-sm text-gray-600">
                <h4 className="font-medium mb-2">L'abonnement premium inclut:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckIcon size={16} className="mr-2 text-green-500 mt-0.5" />
                    <span>Recherches illimitées</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={16} className="mr-2 text-green-500 mt-0.5" />
                    <span>Pas de publicités</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={16} className="mr-2 text-green-500 mt-0.5" />
                    <span>Sauvegarde illimitée de lieux favoris</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon size={16} className="mr-2 text-green-500 mt-0.5" />
                    <span>Partage de cartes personnalisées</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Payment Form */}
        <div className={`${isMobile ? '' : 'col-span-2'}`}>
          <Card>
            <CardHeader>
              <CardTitle>Informations de paiement</CardTitle>
              <CardDescription>Vos informations sont sécurisées et cryptées</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Titulaire de la carte</Label>
                  <Input 
                    id="cardName" 
                    placeholder="Nom sur la carte" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <div className="relative">
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      required
                    />
                    {cardBrand && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm">
                        {cardBrand === 'visa' && 'Visa'}
                        {cardBrand === 'mastercard' && 'MasterCard'}
                        {cardBrand === 'amex' && 'Amex'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Date d'expiration</Label>
                    <Input 
                      id="expiryDate" 
                      placeholder="MM/YY" 
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      value={cvv}
                      onChange={handleCvvChange}
                      required
                      maxLength={4}
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <p className="text-sm text-gray-500">
                    En cliquant sur "S'abonner", vous acceptez les <a href="/cgu" className="text-blue-600 hover:underline">Conditions Générales d'Utilisation</a>.
                  </p>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" className="w-full">
                  S'abonner {selectedPlan === 'monthly' ? '9,99€/mois' : '95,88€/an'}
                </Button>
              </CardFooter>
            </form>
          </Card>
          
          <div className="mt-4 flex items-center justify-center">
            <div className="text-sm text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Paiement sécurisé avec cryptage SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
