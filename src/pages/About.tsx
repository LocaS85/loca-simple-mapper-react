
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Phone, Mail, Users, Coffee, MapIcon, Clock, CheckCircle, Star } from 'lucide-react';
import RouteBackButton from '@/components/ui/RouteBackButton';

const About = () => {
  const isMobile = useIsMobile();
  
  const pricingPlans = [
    {
      name: "Gratuit",
      price: "0€",
      period: "par mois",
      features: [
        "10 recherches par jour",
        "Accès basique aux cartes",
        "Recherche simple",
        "Support communautaire"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "9,99€",
      period: "par mois",
      features: [
        "Recherche illimitée",
        "Cartes détaillées",
        "Filtres avancés",
        "Sans publicité",
        "Support prioritaire"
      ],
      popular: true
    },
    {
      name: "Pro",
      price: "29,99€",
      period: "par mois",
      features: [
        "Tout du Premium",
        "API d'accès",
        "Exportation données",
        "Support 24/7",
        "Intégrations personnalisées"
      ],
      popular: false
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <RouteBackButton route="/" className="mb-4" />
      <h1 className="text-2xl md:text-3xl font-bold mb-6">À propos de LocaSimple</h1>
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-10">
        <div className={`${isMobile ? 'space-y-6' : 'flex items-center gap-8'}`}>
          <div className={`${isMobile ? 'w-full' : 'w-1/2'}`}>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              Notre mission : simplifier la recherche géographique
            </h2>
            <p className="text-gray-600 mb-4">
              LocaSimple est né d'une idée simple : rendre la géolocalisation et la recherche de lieux d'intérêt
              accessible à tous. Notre application permet de trouver rapidement et intuitivement ce que vous 
              cherchez autour de vous.
            </p>
            <Button asChild>
              <a href="/categories">Explorer les catégories</a>
            </Button>
          </div>
          <div className={`${isMobile ? 'w-full h-60' : 'w-1/2 h-80'} bg-gray-200 rounded-lg overflow-hidden`}>
            <img 
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
              alt="Personne utilisant LocaSimple" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Values section */}
      <h2 className="text-xl md:text-2xl font-semibold mb-6">Nos valeurs</h2>
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'} mb-10`}>
        <Card>
          <CardHeader>
            <Users className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Accessibilité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Nous croyons que la technologie de géolocalisation doit être accessible à tous,
              peu importe le niveau de compétence technique. Notre interface est conçue pour
              être intuitive et simple à utiliser.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <MapIcon className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Précision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Nous nous engageons à fournir des informations précises et à jour.
              Nos algorithmes de recherche sont constamment améliorés pour garantir
              des résultats pertinents.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-blue-500 mb-2" />
            <CardTitle>Efficacité</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Votre temps est précieux. Notre application est optimisée pour vous
              permettre de trouver rapidement ce que vous cherchez, sans détours
              inutiles.
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Pricing section */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Nos tarifs</h2>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-3 gap-6'}`}>
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  ⭐ Populaire
                </div>
              )}
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full mt-6 ${plan.popular ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Gratuit" ? "Commencer" : "Choisir ce plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Contact info */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Nous contacter</h2>
        <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-3 gap-6'}`}>
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium">Adresse</h3>
              <p className="text-gray-600">123 Avenue des Champs-Élysées, 75008 Paris, France</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="h-5 w-5 mr-3 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium">Téléphone</h3>
              <p className="text-gray-600">+33 1 23 45 67 89</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <Mail className="h-5 w-5 mr-3 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-gray-600">contact@locasimple.com</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button asChild>
            <a href="/contact">Page de contact</a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
