import React from 'react';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";
import { ErrorBoundary } from 'react-error-boundary';
import { ArrowRight, MapPin, Search, Heart, FileDown, Users, Star, CheckCircle } from 'lucide-react';
import Logo from "@/components/ui/Logo";

// Import images
import heroImage from '@/assets/hero-geolocation.jpg';
import serviceSearchImage from '@/assets/service-search.jpg';
import serviceMapsImage from '@/assets/service-maps.jpg';
import serviceFavoritesImage from '@/assets/service-favorites.jpg';
import serviceExportImage from '@/assets/service-export.jpg';

// Fallback component pour la page d'accueil
function HomeErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Erreur sur la page d'accueil</h2>
        <p className="text-gray-600 mb-4">
          {error.message || "Impossible de charger la page d'accueil"}
        </p>
        <Button asChild>
          <Link to="/geosearch">Aller à la recherche</Link>
        </Button>
      </div>
    </div>
  );
}

export default function Index() {
  const { t } = useTranslations();
  
  const handleExplore = () => {
    try {
      toast.success(t('home.exploreToast', 'Commençons l\'exploration !'));
    } catch (error) {
      console.error('Toast error:', error);
      toast.success('Commençons l\'exploration !');
    }
  };

  const services = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Recherche Avancée",
      description: "Trouvez facilement tous les lieux qui vous intéressent avec notre moteur de recherche intelligent et nos filtres avancés.",
      image: serviceSearchImage
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Cartes Interactives",
      description: "Explorez le monde avec nos cartes détaillées et interactives. Visualisez les routes et planifiez vos déplacements.",
      image: serviceMapsImage
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Favoris & Sauvegarde",
      description: "Sauvegardez vos lieux préférés et créez des collections personnalisées pour retrouver facilement vos destinations.",
      image: serviceFavoritesImage
    },
    {
      icon: <FileDown className="w-8 h-8" />,
      title: "Export PDF",
      description: "Exportez vos recherches et itinéraires en PDF pour les partager ou les consulter hors ligne.",
      image: serviceExportImage
    }
  ];

  const pricingPlans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "par mois",
      features: ["10 recherches par jour", "Cartes de base", "Support communautaire"],
      popular: false
    },
    {
      name: "Pro",
      price: "4,99€",
      period: "par mois",
      features: ["Recherches illimitées", "Cartes premium", "Export PDF", "Support prioritaire"],
      popular: true
    },
    {
      name: "Business",
      price: "19,99€",
      period: "par mois",
      features: ["Multi-utilisateurs", "API accès", "Analytics", "Support dédié 24/7"],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Responsable logistique",
      content: "LS a révolutionné notre façon de gérer les livraisons. Interface intuitive et résultats précis.",
      rating: 5
    },
    {
      name: "Jean Martin",
      role: "Agent immobilier",
      content: "Un outil indispensable pour mes visites clients. La fonction favoris me fait gagner un temps précieux.",
      rating: 5
    },
    {
      name: "Sophie Bernard",
      role: "Travel blogger",
      content: "Parfait pour planifier mes voyages. L'export PDF est un plus pour partager mes itinéraires.",
      rating: 5
    }
  ];

  return (
    <ErrorBoundary FallbackComponent={HomeErrorFallback}>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative w-full py-20 md:py-32 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70"></div>
            </div>
            
            <Container className="relative z-10">
              <div className="flex flex-col items-center text-center text-white space-y-8">
                {/* Logo principal plus grand */}
                <div className="flex justify-center mb-4">
                  <Logo size="lg" variant="white" showText={true} className="scale-150" />
                </div>
                
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
                  🚀 Nouvelle version disponible
                </Badge>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                  LS - Votre solution de 
                  <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                    {" "}géolocalisation
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl max-w-4xl leading-relaxed opacity-90">
                  Découvrez, explorez et naviguez avec la plateforme de géolocalisation 
                  la plus intuitive et complète du marché.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                    <Link to="/geosearch" onClick={handleExplore}>
                      Commencer gratuitement
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                    <Link to="/premium">Voir les tarifs</Link>
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-8 pt-12">
                  <div className="text-center">
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm opacity-80">Utilisateurs actifs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">1M+</div>
                    <div className="text-sm opacity-80">Recherches mensuelles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">99.9%</div>
                    <div className="text-sm opacity-80">Disponibilité</div>
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* Services Section */}
          <section className="w-full py-20 bg-background">
            <Container>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Fonctionnalités principales</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Découvrez tous les outils dont vous avez besoin pour une expérience de géolocalisation optimale.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                  <Card key={index} className="group hover:scale-105 transition-all duration-300 border-0 shadow-lg">
                    <CardContent className="p-0">
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            {service.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>

          {/* Pricing Section */}
          <section className="w-full py-20 bg-muted/50">
            <Container>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Tarifs simples et transparents</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Choisissez le plan qui correspond à vos besoins. Changez à tout moment.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''}`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                        Plus populaire
                      </div>
                    )}
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        asChild 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                      >
                        <Link to="/premium">
                          {plan.name === "Gratuit" ? "Commencer" : "Choisir ce plan"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>

          {/* Testimonials Section */}
          <section className="w-full py-20 bg-background">
            <Container>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Ce que disent nos utilisateurs</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Découvrez pourquoi plus de 50 000 professionnels font confiance à LS.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>

          {/* CTA Section */}
          <section className="w-full py-20 bg-primary text-primary-foreground">
            <Container>
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-4">Prêt à commencer votre aventure ?</h2>
                <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
                  Rejoignez des milliers d'utilisateurs qui font déjà confiance à LS pour leurs besoins de géolocalisation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                    <Link to="/geosearch">Essayer gratuitement</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                    <Link to="/contact">Nous contacter</Link>
                  </Button>
                </div>
              </div>
            </Container>
          </section>
        </main>
      </div>
    </ErrorBoundary>
  );
}