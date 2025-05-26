
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const isMobile = useIsMobile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (!email || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Veuillez entrer une adresse e-mail valide' });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Un e-mail de réinitialisation a été envoyé à votre adresse. Vérifiez votre boîte de réception.' 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto flex justify-center">
        <Card className={`${isMobile ? 'w-full max-w-md' : 'w-[450px]'} shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm`}>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <RouteBackButton route="/login" variant="ghost" size="icon" showLabel={false} />
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Mot de passe oublié
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
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

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse e-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base pl-10 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <p className="font-medium mb-1">Instructions :</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Vérifiez votre boîte de réception et vos spams</li>
                      <li>• Le lien expire dans 60 minutes</li>
                      <li>• Contactez le support si nécessaire</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
              
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Vous vous souvenez de votre mot de passe ?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors">
                    Se connecter
                  </Link>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pas encore de compte ?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
