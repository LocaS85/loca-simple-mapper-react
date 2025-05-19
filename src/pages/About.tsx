
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
import { MapPin, Phone, Mail, Users, Coffee, MapIcon, Clock } from 'lucide-react';

const About = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="container mx-auto px-4 py-8">
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
      
      {/* History section */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Notre histoire</h2>
        <div className={`${isMobile ? 'space-y-6' : 'flex gap-8'}`}>
          <div className={`${isMobile ? 'w-full' : 'w-2/3'}`}>
            <p className="text-gray-600 mb-4">
              Fondée en 2023, LocaSimple est née de la frustration de son fondateur face aux applications
              de cartographie complexes et surchargées. L'idée était simple : créer une alternative
              qui se concentre sur l'essentiel.
            </p>
            <p className="text-gray-600 mb-4">
              Après des mois de développement et de tests avec des utilisateurs réels,
              nous avons lancé notre première version en janvier 2024. Depuis, notre équipe
              s'est agrandie et notre application s'est enrichie de nouvelles fonctionnalités,
              tout en restant fidèle à notre mission initiale : la simplicité avant tout.
            </p>
            <p className="text-gray-600">
              Aujourd'hui, LocaSimple compte plus de 50 000 utilisateurs actifs et continue
              de se développer grâce aux retours de notre communauté engagée.
            </p>
          </div>
          <div className={`${isMobile ? 'w-full h-60' : 'w-1/3 h-auto'} bg-gray-200 rounded-lg overflow-hidden`}>
            <img 
              src="https://images.unsplash.com/photo-1523712999610-f77fbcfc3843" 
              alt="Croissance de LocaSimple" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Team section */}
      <div className="mb-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-6">Notre équipe</h2>
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-4 gap-6'}`}>
          <div className="text-center">
            <div className="w-full aspect-square rounded-full bg-gray-200 overflow-hidden mb-3">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
                alt="Thomas Martin" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium">Thomas Martin</h3>
            <p className="text-sm text-gray-500">Fondateur & CEO</p>
          </div>
          
          <div className="text-center">
            <div className="w-full aspect-square rounded-full bg-gray-200 overflow-hidden mb-3">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" 
                alt="Sophie Dubois" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium">Sophie Dubois</h3>
            <p className="text-sm text-gray-500">Lead Developer</p>
          </div>
          
          <div className="text-center">
            <div className="w-full aspect-square rounded-full bg-gray-200 overflow-hidden mb-3">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" 
                alt="Nicolas Chen" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium">Nicolas Chen</h3>
            <p className="text-sm text-gray-500">UX Designer</p>
          </div>
          
          <div className="text-center">
            <div className="w-full aspect-square rounded-full bg-gray-200 overflow-hidden mb-3">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e" 
                alt="Emma Bernard" 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium">Emma Bernard</h3>
            <p className="text-sm text-gray-500">Marketing</p>
          </div>
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
