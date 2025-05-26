
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { Eye, EyeOff, AlertCircle, CheckCircle, Check, X } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const isMobile = useIsMobile();

  // Fonction pour calculer la force du mot de passe
  const getPasswordStrength = (password: string) => {
    let score = 0;
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    Object.values(checks).forEach(check => check && score++);
    
    return {
      score,
      percentage: (score / 5) * 100,
      level: score < 2 ? 'Faible' : score < 4 ? 'Moyen' : 'Fort',
      color: score < 2 ? 'bg-red-500' : score < 4 ? 'bg-yellow-500' : 'bg-green-500',
      checks
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validations
    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: 'Le nom complet est requis' });
      setIsLoading(false);
      return;
    }

    if (!formData.email || !formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Veuillez entrer une adresse e-mail valide' });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 8 caractères' });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setMessage({ type: 'error', text: 'Vous devez accepter les conditions générales' });
      setIsLoading(false);
      return;
    }

    try {
      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Registration form submitted', formData);
      
      setMessage({ type: 'success', text: 'Inscription réussie ! Redirection vers la connexion...' });
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setMessage({ type: 'error', text: 'Inscription Google en cours de développement...' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="container mx-auto flex justify-center">
        <Card className={`${isMobile ? 'w-full max-w-md' : 'w-[450px]'} shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm`}>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <RouteBackButton route="/" variant="ghost" size="icon" showLabel={false} />
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Créer un compte
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Inscrivez-vous pour accéder à toutes les fonctionnalités
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
                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nom complet
                </Label>
                <Input 
                  id="fullName"
                  type="text"
                  placeholder="Votre nom complet"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  required
                  className="h-12 text-base border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Adresse e-mail
                </Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="exemple@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                  className="h-12 text-base border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 caractères"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    className="h-12 text-base pr-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                {formData.password && (
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Force du mot de passe:</span>
                      <span className={`text-xs font-medium ${passwordStrength.score < 2 ? 'text-red-500' : passwordStrength.score < 4 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {passwordStrength.level}
                      </span>
                    </div>
                    <Progress value={passwordStrength.percentage} className="h-2" />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center space-x-1 ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.length ? <Check size={12} /> : <X size={12} />}
                        <span>8+ caractères</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.uppercase ? <Check size={12} /> : <X size={12} />}
                        <span>Majuscule</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.lowercase ? <Check size={12} /> : <X size={12} />}
                        <span>Minuscule</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.number ? <Check size={12} /> : <X size={12} />}
                        <span>Chiffre</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirmer le mot de passe
                </Label>
                <div className="relative">
                  <Input 
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez votre mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className="h-12 text-base pr-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 flex items-center space-x-1">
                    <X size={12} />
                    <span>Les mots de passe ne correspondent pas</span>
                  </p>
                )}
              </div>
              
              <div className="flex items-start space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={() => setAcceptTerms(!acceptTerms)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 mt-1"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  J'accepte les{' '}
                  <Link to="/conditions" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium">
                    Conditions Générales d'Utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium">
                    Politique de Confidentialité
                  </Link>
                </label>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                disabled={!acceptTerms || isLoading}
              >
                {isLoading ? 'Inscription en cours...' : "S'inscrire"}
              </Button>

              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Ou</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                onClick={handleGoogleSignUp}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                S'inscrire avec Google
              </Button>
              
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Vous avez déjà un compte?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors">
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
