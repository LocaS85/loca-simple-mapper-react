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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { CheckIcon, CreditCard, Shield, Lock, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

type PlanType = 'monthly' | 'annual';
type CardBrand = 'visa' | 'mastercard' | 'amex' | '';
type PaymentMethod = 'card' | 'paypal';
type BillingType = 'auto' | 'manual';

const Payment = () => {
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const urlPlan = searchParams.get('plan') as PlanType;
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(urlPlan || 'monthly');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [billingType, setBillingType] = useState<BillingType>('auto');
  const [cardNumber, setCardNumber] = useState('');
  const [cardBrand, setCardBrand] = useState<CardBrand>('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Prix
  const monthlyPrice = 9.99;
  const annualPrice = 95.88;
  const savings = ((monthlyPrice * 12) - annualPrice).toFixed(2);

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 0) {
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
    
    if (value.length > 16) value = value.slice(0, 16);
    const parts = [];
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4));
    }
    setCardNumber(parts.join(' '));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setMessage(null);

    // Validation
    if (paymentMethod === 'card') {
      if (!cardName.trim()) {
        setMessage({ type: 'error', text: 'Le nom du titulaire est requis' });
        setIsProcessing(false);
        return;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        setMessage({ type: 'error', text: 'Numéro de carte invalide' });
        setIsProcessing(false);
        return;
      }
      if (!expiryDate || expiryDate.length < 5) {
        setMessage({ type: 'error', text: 'Date d\'expiration invalide' });
        setIsProcessing(false);
        return;
      }
      if (cvv.length < 3) {
        setMessage({ type: 'error', text: 'CVV invalide' });
        setIsProcessing(false);
        return;
      }
    }

    try {
      // Simulation du traitement de paiement
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Payment processed', {
        plan: selectedPlan,
        paymentMethod,
        billingType,
        amount: selectedPlan === 'monthly' ? monthlyPrice : annualPrice
      });
      
      setMessage({ type: 'success', text: 'Paiement traité avec succès! Redirection...' });
      
      setTimeout(() => {
        window.location.href = '/account';
      }, 2000);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur lors du traitement du paiement. Veuillez réessayer.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPal = () => {
    setMessage({ type: 'error', text: 'Paiement PayPal en cours de développement...' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-6">
          <RouteBackButton route="/premium" />
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Abonnement Premium
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Débloquez toutes les fonctionnalités avancées de LocaSimple
          </p>
        </div>
        
        <div className={`${isMobile ? 'flex flex-col space-y-6' : 'grid grid-cols-5 gap-8'}`}>
          {/* Plan Selection */}
          <div className={`${isMobile ? '' : 'col-span-2'}`}>
            <Card className="h-fit shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span>Choisissez votre formule</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Retour
                  </Button>
                </CardTitle>
                <CardDescription>
                  Accédez à toutes les fonctionnalités premium
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Plan selection options */}
                <div 
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 ${
                    selectedPlan === 'monthly' 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPlan('monthly')}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">Mensuel</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Facturé mensuellement</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-2xl">{monthlyPrice}€</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">TTC/mois</div>
                    </div>
                  </div>
                  {selectedPlan === 'monthly' && (
                    <div className="mt-3 text-blue-600 dark:text-blue-400 flex items-center">
                      <CheckIcon size={16} className="mr-2" />
                      <span className="text-sm font-medium">Plan sélectionné</span>
                    </div>
                  )}
                </div>
                
                <div 
                  className={`p-4 rounded-xl cursor-pointer border-2 transition-all duration-200 relative ${
                    selectedPlan === 'annual' 
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  onClick={() => setSelectedPlan('annual')}
                >
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Économisez {savings}€
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">Annuel</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Facturé annuellement</p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">
                        -20% par rapport au mensuel
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-2xl">{annualPrice}€</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">≈ 7,99€/mois</div>
                    </div>
                  </div>
                  {selectedPlan === 'annual' && (
                    <div className="mt-3 text-blue-600 dark:text-blue-400 flex items-center">
                      <CheckIcon size={16} className="mr-2" />
                      <span className="text-sm font-medium">Plan sélectionné</span>
                    </div>
                  )}
                </div>

                {/* Billing Type Selection */}
                <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Type de prélèvement :</h4>
                  <div className="space-y-2">
                    <div 
                      className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        billingType === 'auto' 
                          ? 'border-blue-500 bg-blue-100 dark:bg-blue-800/30' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setBillingType('auto')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={billingType === 'auto'}
                          onChange={() => setBillingType('auto')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">Prélèvement automatique</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Renouvellement automatique (recommandé)</div>
                        </div>
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                          Recommandé
                        </div>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-3 rounded-lg cursor-pointer border-2 transition-all ${
                        billingType === 'manual' 
                          ? 'border-blue-500 bg-blue-100 dark:bg-blue-800/30' 
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                      }`}
                      onClick={() => setBillingType('manual')}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          checked={billingType === 'manual'}
                          onChange={() => setBillingType('manual')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 dark:text-white">Prélèvement manuel</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Paiement {selectedPlan === 'monthly' ? 'mois par mois' : 'annuel'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {/* Features list */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Fonctionnalités incluses :</h4>
                  <div className="space-y-2">
                    {[
                      'Recherches géographiques illimitées',
                      'Pas de publicités',
                      'Sauvegarde illimitée de favoris',
                      'Export de cartes personnalisées',
                      'Support prioritaire 24/7',
                      'Analyse avancée des trajets'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckIcon size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Payment Form */}
          <div className={`${isMobile ? '' : 'col-span-3'}`}>
            <Card className="shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span>Informations de paiement</span>
                </CardTitle>
                <CardDescription>
                  Choisissez votre méthode de paiement préférée
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-6">
                  {message && (
                    <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="animate-fade-in">
                      {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                  )}

                  {/* Payment Method Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Méthode de paiement
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                          paymentMethod === 'card'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="h-5 w-5" />
                        <span>Carte bancaire</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                          paymentMethod === 'paypal'
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'
                        }`}
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0070ba">
                          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.04c-.022.38-.295.718-.623.718H18.85L17.7 14.738h1.542c.524 0 .968-.382 1.05-.9l.93-5.921z"/>
                        </svg>
                        <span>PayPal</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'card' ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Nom du titulaire
                        </Label>
                        <Input 
                          id="cardName" 
                          placeholder="Nom complet sur la carte" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                          className="h-12 text-base"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Numéro de carte
                        </Label>
                        <div className="relative">
                          <Input 
                            id="cardNumber" 
                            placeholder="1234 5678 9012 3456" 
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            required
                            className="h-12 text-base pr-16"
                          />
                          {cardBrand && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                {cardBrand === 'visa' && 'VISA'}
                                {cardBrand === 'mastercard' && 'MC'}
                                {cardBrand === 'amex' && 'AMEX'}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Date d'expiration
                          </Label>
                          <Input 
                            id="expiryDate" 
                            placeholder="MM/YY" 
                            value={expiryDate}
                            onChange={handleExpiryDateChange}
                            required
                            className="h-12 text-base"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            CVV
                          </Label>
                          <Input 
                            id="cvv" 
                            placeholder="123" 
                            value={cvv}
                            onChange={handleCvvChange}
                            required
                            maxLength={4}
                            className="h-12 text-base"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                      <svg className="mx-auto h-16 w-16 mb-4" viewBox="0 0 24 24" fill="#0070ba">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.04c-.022.38-.295.718-.623.718H18.85L17.7 14.738h1.542c.524 0 .968-.382 1.05-.9l.93-5.921z"/>
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Vous serez redirigé vers PayPal
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Paiement sécurisé via PayPal
                      </p>
                    </div>
                  )}
                  
                  <Separator />
                  
                  {/* Order Summary */}
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Récapitulatif de commande</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Plan {selectedPlan === 'monthly' ? 'Mensuel' : 'Annuel'}</span>
                        <span>{selectedPlan === 'monthly' ? monthlyPrice : annualPrice}€</span>
                      </div>
                      {selectedPlan === 'annual' && (
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>Économies annuelles</span>
                          <span>-{savings}€</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Type de prélèvement</span>
                        <span>{billingType === 'auto' ? 'Automatique' : 'Manuel'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA (20%)</span>
                        <span>Incluse</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total TTC</span>
                        <span>{selectedPlan === 'monthly' ? monthlyPrice : annualPrice}€</span>
                      </div>
                      {billingType === 'auto' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Renouvellement automatique {selectedPlan === 'monthly' ? 'mensuel' : 'annuel'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p>
                      En cliquant sur "Payer maintenant", vous acceptez les{' '}
                      <a href="/conditions" className="text-blue-600 hover:underline">
                        Conditions Générales d'Utilisation
                      </a>
                      {' '}et autorisez le prélèvement.
                    </p>
                    <p>
                      Vous pouvez annuler votre abonnement à tout moment depuis votre compte.
                    </p>
                  </div>
                </CardContent>
                
                <CardFooter className="space-y-4">
                  {paymentMethod === 'card' ? (
                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-green-600 hover:bg-green-700 text-white text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Traitement en cours...</span>
                        </div>
                      ) : (
                        `Payer ${selectedPlan === 'monthly' ? monthlyPrice : annualPrice}€ maintenant`
                      )}
                    </Button>
                  ) : (
                    <Button 
                      type="button"
                      onClick={handlePayPal}
                      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold"
                    >
                      Continuer avec PayPal
                    </Button>
                  )}
                  
                  <div className="w-full flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Lock className="h-3 w-3" />
                      <span>Cryptage SSL 256-bit</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-3 w-3" />
                      <span>Paiement sécurisé</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CheckIcon className="h-3 w-3" />
                      <span>Stripe certifié</span>
                    </div>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
