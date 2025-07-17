import React from 'react';
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";
import { ErrorBoundary } from 'react-error-boundary';
import { ArrowRight, MapPin, Search, Heart, FileDown, Users, Star, CheckCircle, Play, Shield, Clock, Award } from 'lucide-react';
import Logo from "@/components/ui/Logo";
import Footer from '@/components/Footer';
import Header from '@/components/Header';

// Import images
import heroImage from '@/assets/hero-modern.jpg';
import demoPhoneImage from '@/assets/demo-phone.jpg';
import demoLaptopImage from '@/assets/demo-laptop.jpg';
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
      popular: false,
      planId: "free"
    },
    {
      name: "Essentiel",
      price: "4,99€",
      period: "par mois",
      features: ["Recherches illimitées", "Cartes premium", "Export PDF", "Support prioritaire"],
      popular: true,
      planId: "essential"
    },
    {
      name: "Pro",
      price: "9,99€",
      period: "par mois",
      features: ["Tout de l'Essentiel", "API accès", "Analytics", "Support dédié 24/7"],
      popular: false,
      planId: "pro"
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
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative w-full py-20 md:py-32 overflow-hidden bg-gradient-to-br from-primary via-locasimple-blue to-locasimple-teal">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
            
            <Container className="relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Contenu principal */}
                <div className="text-white space-y-8">
                  {/* Logo LS plus grand et intégré */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                      <span className="text-3xl font-bold text-white">LS</span>
                    </div>
                    <div>
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                        LocaSimple
                      </h1>
                      <p className="text-lg opacity-90">Votre solution de géolocalisation</p>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2 backdrop-blur-sm">
                    🚀 Nouveau : API Pro disponible
                  </Badge>
                  
                  <h2 className="text-2xl md:text-3xl font-medium leading-relaxed opacity-95">
                    Découvrez, explorez et naviguez avec la plateforme de géolocalisation 
                    la plus intuitive et complète du marché.
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 shadow-lg">
                      <Link to="/geosearch" onClick={handleExplore}>
                        Commencer gratuitement
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                     <Button asChild variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6 backdrop-blur-sm">
                       <Link to="/about">
                         <Play className="mr-2 w-5 h-5" />
                         Voir la démo
                       </Link>
                     </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-6 pt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold">50K+</div>
                      <div className="text-sm opacity-80">Utilisateurs actifs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">1M+</div>
                      <div className="text-sm opacity-80">Recherches/mois</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold">99.9%</div>
                      <div className="text-sm opacity-80">Uptime</div>
                    </div>
                  </div>
                </div>

                {/* Images de démonstration */}
                <div className="relative">
                  <div className="relative z-10">
                    <img 
                      src={demoPhoneImage} 
                      alt="Application mobile LS"
                      className="w-full max-w-md mx-auto rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute top-10 -left-10 z-0">
                    <img 
                      src={demoLaptopImage} 
                      alt="Dashboard LS"
                      className="w-full max-w-sm rounded-xl shadow-xl opacity-80 transform -rotate-6 hover:-rotate-3 transition-transform duration-300"
                    />
                  </div>
                </div>
              </div>
            </Container>
          </section>

          {/* Avantages Section */}
          <section className="w-full py-20 bg-muted/30">
            <Container>
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Pourquoi choisir LS ?</Badge>
                <h2 className="text-4xl font-bold mb-4">Les avantages qui font la différence</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Une plateforme pensée pour tous vos besoins de géolocalisation, du particulier à l'entreprise.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sécurisé</h3>
                  <p className="text-muted-foreground">Vos données sont protégées par un chiffrement de niveau bancaire</p>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0">
                  <div className="w-16 h-16 bg-locasimple-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-locasimple-teal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Temps réel</h3>
                  <p className="text-muted-foreground">Informations mises à jour en continu pour une précision maximale</p>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0">
                  <div className="w-16 h-16 bg-locasimple-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-locasimple-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Collaboratif</h3>
                  <p className="text-muted-foreground">Partagez vos cartes et itinéraires avec votre équipe facilement</p>
                </Card>

                <Card className="text-center p-6 hover:shadow-lg transition-all duration-300 border-0">
                  <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Primé</h3>
                  <p className="text-muted-foreground">Solution reconnue par les professionnels de la géolocalisation</p>
                </Card>
              </div>
            </Container>
          </section>

          {/* Services Section */}
          <section className="w-full py-20 bg-background">
            <Container>
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Fonctionnalités</Badge>
                <h2 className="text-4xl font-bold mb-4">Tout ce dont vous avez besoin</h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Des outils professionnels pour une expérience de géolocalisation optimale et intuitive.
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
                        <Button variant="ghost" className="mt-4 p-0 h-auto">
                          En savoir plus <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Container>
          </section>

          {/* Pricing Section */}
          <section className="w-full py-20 bg-gradient-to-br from-muted/20 to-muted/40">
            <Container>
              <div className="text-center mb-16">
                <Badge variant="outline" className="mb-4">Tarification</Badge>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-locasimple-teal bg-clip-text text-transparent">
                  Tarifs simples et transparents
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Choisissez le plan qui correspond à vos besoins. Changez ou annulez à tout moment.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {pricingPlans.map((plan, index) => (
                  <Card key={index} className={`relative border-0 shadow-xl hover:shadow-2xl transition-all duration-300 ${
                    plan.popular 
                      ? 'ring-2 ring-primary scale-105 bg-gradient-to-br from-primary/5 to-locasimple-teal/5' 
                      : 'hover:scale-105'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-locasimple-teal text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                        ⭐ Plus populaire
                      </div>
                    )}
                    <CardContent className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-5xl font-bold bg-gradient-to-r from-primary to-locasimple-teal bg-clip-text text-transparent">
                          {plan.price}
                        </span>
                        <span className="text-muted-foreground text-lg">/{plan.period}</span>
                      </div>
                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center text-left">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full text-lg py-6" 
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={() => {
                          if (plan.planId === 'free') {
                            window.location.href = '/geosearch';
                          } else {
                            window.location.href = `/premium?plan=${plan.planId}`;
                          }
                        }}
                      >
                        {plan.name === "Gratuit" ? "Commencer gratuitement" : "Choisir ce plan"}
                      </Button>
                      {plan.name === "Gratuit" && (
                        <p className="text-xs text-muted-foreground mt-3">Aucune carte bancaire requise</p>
                      )}
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
                   <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6">
                     <Link to="/contact">Nous contacter</Link>
                   </Button>
                </div>
              </div>
            </Container>
          </section>
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}