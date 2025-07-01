import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  
  const { signIn, signUp, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const validateForm = () => {
    if (!formData.email || !formData.email.includes('@')) {
      setMessage({ type: 'error', text: 'Veuillez entrer une adresse e-mail valide' });
      return false;
    }

    if (!formData.password || formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
      return false;
    }

    if (activeTab === 'signup') {
      if (!formData.fullName || formData.fullName.length < 2) {
        setMessage({ type: 'error', text: 'Veuillez entrer votre nom complet' });
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      if (activeTab === 'login') {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          setMessage({ type: 'success', text: 'Connexion réussie ! Redirection...' });
          setTimeout(() => navigate('/'), 1500);
        }
      } else {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (!error) {
          setMessage({ type: 'success', text: 'Inscription réussie ! Vérifiez votre email.' });
          setFormData({ email: '', password: '', fullName: '', confirmPassword: '' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-4 px-4 sm:py-8">
      <div className="container mx-auto flex justify-center">
        <Card className={`${isMobile ? 'w-full max-w-md' : 'w-[480px]'} shadow-xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm`}>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <RouteBackButton route="/" variant="ghost" size="icon" showLabel={false} />
              <div className="flex-1 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeTab === 'login' ? 'Se connecter' : 'S\'inscrire'}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              {activeTab === 'login' 
                ? 'Accédez à votre compte LocaSimple' 
                : 'Créez votre compte LocaSimple'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-sm">Connexion</TabsTrigger>
                <TabsTrigger value="signup" className="text-sm">Inscription</TabsTrigger>
              </TabsList>

              {message && (
                <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="animate-fade-in">
                  {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TabsContent value="login" className="space-y-4 mt-0">
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
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-12 text-base pl-10 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Votre mot de passe"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className="h-12 text-base pl-10 pr-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                      />
                      <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                        Se souvenir de moi
                      </label>
                    </div>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nom complet
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        id="fullName"
                        type="text"
                        placeholder="Prénom Nom"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                        className="h-12 text-base pl-10 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Adresse e-mail
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        id="signup-email"
                        type="email"
                        placeholder="exemple@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        className="h-12 text-base pl-10 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Choisissez un mot de passe"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        required
                        className="h-12 text-base pl-10 pr-12 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirmer le mot de passe
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input 
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirmez votre mot de passe"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        required
                        className="h-12 text-base pl-10 border-gray-200 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
                      />
                    </div>
                  </div>
                </TabsContent>

                <div className="flex flex-col space-y-4 pt-6">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading 
                      ? (activeTab === 'login' ? 'Connexion en cours...' : 'Inscription en cours...') 
                      : (activeTab === 'login' ? 'Se connecter' : 'S\'inscrire')
                    }
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;