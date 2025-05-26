
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="mb-6">
            <RouteBackButton />
          </div>
          
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-6">Politique de Confidentialité</h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">
                Résumé de notre politique
              </h2>
              <p className="text-blue-700 dark:text-blue-300">
                Nous respectons votre vie privée et protégeons vos données personnelles. Cette politique 
                explique comment nous collectons, utilisons et protégeons vos informations conformément 
                au RGPD et aux autres réglementations en vigueur.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <h2 className="text-xl font-semibold">1. Collecte des données</h2>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <h3 className="text-lg font-medium">Types de données collectées :</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Données d'identification :</strong> nom, prénom, adresse e-mail</li>
                    <li><strong>Données de géolocalisation :</strong> position GPS pour les recherches locales</li>
                    <li><strong>Données de navigation :</strong> pages visitées, temps passé, interactions</li>
                    <li><strong>Données techniques :</strong> adresse IP, type d'appareil, navigateur</li>
                    <li><strong>Données de préférences :</strong> favoris, historique de recherches</li>
                  </ul>
                  
                  <h3 className="text-lg font-medium mt-6">Moyens de collecte :</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Formulaires d'inscription et de connexion</li>
                    <li>Utilisation de l'application (recherches, navigation)</li>
                    <li>Cookies et technologies similaires</li>
                    <li>APIs de géolocalisation (avec votre consentement)</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <h2 className="text-xl font-semibold">2. Utilisation des données</h2>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>Nous utilisons vos données personnelles pour :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Fonctionnement du service :</strong> 
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Fournir des résultats de recherche géographique personnalisés</li>
                        <li>Sauvegarder vos favoris et préférences</li>
                        <li>Gérer votre compte utilisateur</li>
                      </ul>
                    </li>
                    <li><strong>Amélioration de l'application :</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Analyser l'utilisation pour optimiser l'interface</li>
                        <li>Développer de nouvelles fonctionnalités</li>
                        <li>Corriger les bugs et améliorer la performance</li>
                      </ul>
                    </li>
                    <li><strong>Communication :</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Notifications importantes sur le service</li>
                        <li>Support client et assistance technique</li>
                        <li>Newsletters (avec votre consentement explicite)</li>
                      </ul>
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <h2 className="text-xl font-semibold">3. Partage avec des tiers</h2>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>Nous partageons vos données uniquement dans les cas suivants :</p>
                  
                  <h3 className="text-lg font-medium">Prestataires de services :</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Hébergement :</strong> Supabase (PostgreSQL, stockage sécurisé)</li>
                    <li><strong>Cartes et géolocalisation :</strong> Mapbox (données de cartographie)</li>
                    <li><strong>Analytics :</strong> outils d'analyse anonymisée du trafic</li>
                    <li><strong>Support :</strong> plateforme de tickets et chat client</li>
                  </ul>

                  <h3 className="text-lg font-medium mt-4">Obligations légales :</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Réquisitions judiciaires ou administratives</li>
                    <li>Lutte contre la fraude et la cybercriminalité</li>
                    <li>Protection de nos droits et de ceux de nos utilisateurs</li>
                  </ul>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mt-4">
                    <p className="text-yellow-800 dark:text-yellow-200">
                      <strong>Important :</strong> Nous ne vendons jamais vos données personnelles 
                      à des tiers à des fins commerciales.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <h2 className="text-xl font-semibold">4. Vos droits (RGPD)</h2>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p>Conformément au RGPD, vous disposez des droits suivants :</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h3 className="font-medium">🔍 Droit d'accès</h3>
                      <p className="text-sm">Demander quelles données nous détenons sur vous</p>
                      
                      <h3 className="font-medium">✏️ Droit de rectification</h3>
                      <p className="text-sm">Corriger des informations inexactes ou incomplètes</p>
                      
                      <h3 className="font-medium">🗑️ Droit à l'effacement</h3>
                      <p className="text-sm">Demander la suppression de vos données ("droit à l'oubli")</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium">⏸️ Droit à la limitation</h3>
                      <p className="text-sm">Limiter le traitement de vos données</p>
                      
                      <h3 className="font-medium">📦 Droit à la portabilité</h3>
                      <p className="text-sm">Récupérer vos données dans un format lisible</p>
                      
                      <h3 className="font-medium">🚫 Droit d'opposition</h3>
                      <p className="text-sm">Vous opposer au traitement de vos données</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      Comment exercer vos droits :
                    </h3>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Directement depuis votre compte utilisateur</li>
                      <li>• Par e-mail : <a href="mailto:privacy@locasimple.com" className="underline">privacy@locasimple.com</a></li>
                      <li>• Via notre formulaire de contact</li>
                    </ul>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      Délai de réponse : 30 jours maximum
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <h2 className="text-xl font-semibold">5. Cookies et tracking</h2>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <h3 className="text-lg font-medium">Types de cookies utilisés :</h3>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-medium">🔒 Cookies strictement nécessaires</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Session utilisateur, préférences de langue, sécurité - 
                        <span className="text-green-600 font-medium">Toujours actifs</span>
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium">📊 Cookies analytiques</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Statistiques d'usage anonymisées - 
                        <span className="text-blue-600 font-medium">Avec votre consentement</span>
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-medium">🎯 Cookies de préférences</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Mémorisation de vos choix d'interface - 
                        <span className="text-purple-600 font-medium">Avec votre consentement</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Gestion des cookies :</h3>
                    <ul className="text-sm space-y-1">
                      <li>• Paramètres de cookies dans l'application</li>
                      <li>• Configuration de votre navigateur</li>
                      <li>• Extensions de blocage des trackers</li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <h2 className="text-xl font-semibold">6. Sécurité des données</h2>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <h3 className="text-lg font-medium">Mesures techniques :</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Chiffrement :</strong> SSL/TLS pour toutes les communications</li>
                    <li><strong>Hachage :</strong> mots de passe sécurisés avec bcrypt</li>
                    <li><strong>Authentification :</strong> sessions sécurisées et tokens JWT</li>
                    <li><strong>Base de données :</strong> accès restreint et backups chiffrés</li>
                    <li><strong>Infrastructure :</strong> hébergement sécurisé (Supabase/AWS)</li>
                  </ul>

                  <h3 className="text-lg font-medium mt-4">Mesures organisationnelles :</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Accès aux données limité aux employés autorisés</li>
                    <li>Formation régulière de l'équipe sur la sécurité</li>
                    <li>Audits de sécurité périodiques</li>
                    <li>Plan de réponse aux incidents de sécurité</li>
                  </ul>

                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                    <h3 className="font-medium text-red-800 dark:text-red-200 mb-2">
                      En cas de violation de données :
                    </h3>
                    <p className="text-red-700 dark:text-red-300 text-sm">
                      Nous vous informerons dans les 72 heures et prendrons toutes les 
                      mesures nécessaires pour protéger vos données et limiter l'impact.
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <h2 className="text-xl font-semibold">7. Contact et réclamations</h2>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <h3 className="text-lg font-medium">Délégué à la Protection des Données (DPO) :</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p><strong>Email :</strong> <a href="mailto:dpo@locasimple.com" className="text-blue-600 hover:underline">dpo@locasimple.com</a></p>
                    <p><strong>Adresse :</strong> LocaSimple - Service DPO<br />
                    123 Rue de la Tech, 75001 Paris, France</p>
                  </div>

                  <h3 className="text-lg font-medium">Support utilisateur :</h3>
                  <div className="space-y-2">
                    <p><strong>Email :</strong> <a href="mailto:support@locasimple.com" className="text-blue-600 hover:underline">support@locasimple.com</a></p>
                    <p><strong>Formulaire :</strong> <a href="/contact" className="text-blue-600 hover:underline">Page de contact</a></p>
                    <p><strong>Horaires :</strong> Lundi-Vendredi, 9h-18h (CET)</p>
                  </div>

                  <h3 className="text-lg font-medium">Autorité de contrôle :</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p>Si vous n'êtes pas satisfait de notre réponse, vous pouvez déposer une réclamation auprès de :</p>
                    <p className="mt-2">
                      <strong>CNIL (Commission Nationale de l'Informatique et des Libertés)</strong><br />
                      3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br />
                      <a href="https://www.cnil.fr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mt-8">
              <h2 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200">
                Modifications de cette politique
              </h2>
              <p className="text-green-700 dark:text-green-300">
                Nous pouvons mettre à jour cette politique de confidentialité pour refléter les changements 
                dans nos pratiques ou pour des raisons légales. Toute modification substantielle vous sera 
                notifiée par e-mail ou via l'application au moins 30 jours avant sa prise d'effet.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
