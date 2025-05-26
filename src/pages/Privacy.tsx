
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Download, Eye, Lock, Users, Settings, AlertCircle } from 'lucide-react';

const Privacy = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('privacy@locasimple.com');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  const lastUpdated = "26 mai 2025";

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <Container className="max-w-4xl">
          <div className="mb-6">
            <RouteBackButton route="/" />
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 md:p-8 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Politique de Confidentialité
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              Votre confidentialité est notre priorité. Cette politique explique comment nous collectons, 
              utilisons et protégeons vos données personnelles.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <AlertCircle className="h-4 w-4" />
              <span>Dernière mise à jour : {lastUpdated}</span>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <Accordion type="single" collapsible className="space-y-4">
              
              <AccordionItem value="introduction" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span>1. Introduction</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    LocaSimple ("nous", "notre" ou "nos") s'engage à protéger et respecter votre vie privée. 
                    Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et 
                    partageons vos informations personnelles lorsque vous utilisez notre application de géolocalisation.
                  </p>
                  <p>
                    Cette politique s'applique à tous les utilisateurs de LocaSimple, qu'ils soient inscrits ou non. 
                    En utilisant notre service, vous consentez aux pratiques décrites dans cette politique.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="collecte" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>2. Collecte des Données</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <h4 className="font-semibold mb-3">Données que nous collectons :</h4>
                  <div className="space-y-3">
                    <div>
                      <strong>Données de géolocalisation :</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Position GPS (latitude/longitude) avec votre consentement</li>
                        <li>Adresses recherchées et points d'intérêt consultés</li>
                        <li>Historique de navigation géographique</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Données personnelles :</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Nom et adresse e-mail (comptes inscrits)</li>
                        <li>Préférences utilisateur et paramètres</li>
                        <li>Données de connexion (horodatage, durée de session)</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Données techniques :</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Type d'appareil, système d'exploitation, navigateur</li>
                        <li>Adresse IP et données de connexion réseau</li>
                        <li>Cookies et technologies similaires</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="utilisation" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span>3. Utilisation des Données</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <h4 className="font-semibold mb-3">Nous utilisons vos données pour :</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Services principaux</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Fournir des résultats de géolocalisation</li>
                        <li>• Personnaliser votre expérience</li>
                        <li>• Sauvegarder vos préférences</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 dark:text-green-300 mb-2">Amélioration</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Analyser l'utilisation de l'application</li>
                        <li>• Améliorer nos algorithmes</li>
                        <li>• Développer de nouvelles fonctionnalités</li>
                      </ul>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                      <h5 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">Communication</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Vous envoyer des mises à jour importantes</li>
                        <li>• Répondre à vos questions</li>
                        <li>• Support technique</li>
                      </ul>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                      <h5 className="font-medium text-red-800 dark:text-red-300 mb-2">Sécurité</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Prévenir la fraude</li>
                        <li>• Assurer la sécurité du service</li>
                        <li>• Respecter nos obligations légales</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="partage" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <span>4. Partage avec des Tiers</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                    <p className="text-amber-800 dark:text-amber-300 font-medium">
                      🛡️ Nous ne vendons jamais vos données personnelles à des tiers.
                    </p>
                  </div>
                  <h4 className="font-semibold mb-3">Nous pouvons partager certaines informations avec :</h4>
                  <div className="space-y-4">
                    <div>
                      <strong>Prestataires de services :</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Hébergeurs de données (sécurisés et certifiés)</li>
                        <li>Services d'analyse (données anonymisées)</li>
                        <li>Prestataires de support technique</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Obligations légales :</strong>
                      <ul className="list-disc pl-6 mt-2 space-y-1">
                        <li>Autorités judiciaires sur demande légale</li>
                        <li>Forces de l'ordre dans le cadre d'enquêtes</li>
                        <li>Organismes de régulation compétents</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="droits" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    <span>5. Vos Droits (RGPD)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <p className="mb-4">
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">🔍 Droit d'accès</h5>
                      <p className="text-sm">Demander une copie de toutes vos données personnelles</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">✏️ Droit de rectification</h5>
                      <p className="text-sm">Corriger des données incorrectes ou incomplètes</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">🗑️ Droit à l'effacement</h5>
                      <p className="text-sm">Demander la suppression de vos données</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">⏸️ Droit de limitation</h5>
                      <p className="text-sm">Limiter le traitement de vos données</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">📱 Droit de portabilité</h5>
                      <p className="text-sm">Récupérer vos données dans un format structuré</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h5 className="font-medium mb-2">🚫 Droit d'opposition</h5>
                      <p className="text-sm">Vous opposer au traitement de vos données</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Pour exercer vos droits :
                    </h5>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={copyEmail}
                        variant="outline" 
                        size="sm"
                        className="flex items-center space-x-2"
                      >
                        <Mail className="h-4 w-4" />
                        <span>{emailCopied ? 'E-mail copié !' : 'privacy@locasimple.com'}</span>
                      </Button>
                      <Button variant="outline" size="sm">
                        Formulaire de contact
                      </Button>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                      Délai de réponse : 30 jours maximum
                    </p>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cookies" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                    <span>6. Cookies et Technologies de Suivi</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Types de cookies utilisés :</h5>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1.5"></div>
                          <div>
                            <strong>Cookies essentiels</strong> - Nécessaires au fonctionnement de l'application
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-1.5"></div>
                          <div>
                            <strong>Cookies de préférences</strong> - Mémorisent vos paramètres et choix
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1.5"></div>
                          <div>
                            <strong>Cookies analytiques</strong> - Nous aident à comprendre l'utilisation
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h5 className="font-medium mb-2">Gestion des cookies :</h5>
                      <p className="text-sm mb-3">
                        Vous pouvez contrôler et désactiver les cookies via les paramètres de votre navigateur. 
                        Notez que certaines fonctionnalités peuvent être limitées.
                      </p>
                      <Button variant="outline" size="sm">
                        Gérer les préférences cookies
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="securite" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <span>7. Sécurité des Données</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <div className="space-y-4">
                    <p>
                      Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles appropriées 
                      pour protéger vos informations personnelles :
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h5 className="font-medium">Mesures techniques :</h5>
                        <ul className="text-sm space-y-1">
                          <li>🔐 Chiffrement SSL/TLS pour les transmissions</li>
                          <li>🛡️ Chiffrement des données sensibles</li>
                          <li>🔥 Pare-feu et protection contre les intrusions</li>
                          <li>🔄 Sauvegardes automatiques sécurisées</li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium">Mesures organisationnelles :</h5>
                        <ul className="text-sm space-y-1">
                          <li>👤 Accès limité aux données (principe du besoin de savoir)</li>
                          <li>📋 Audits de sécurité réguliers</li>
                          <li>🎓 Formation du personnel à la sécurité</li>
                          <li>📝 Politique de sécurité stricte</li>
                        </ul>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-800 dark:text-red-300 text-sm">
                        <strong>En cas de violation de données :</strong> Nous vous notifierons dans les 72 heures 
                        conformément au RGPD et prendrons toutes les mesures nécessaires pour limiter l'impact.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contact" className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <AccordionTrigger className="px-6 py-4 text-left font-semibold text-gray-900 dark:text-white hover:no-underline">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <span>8. Nous Contacter</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                  <div className="space-y-4">
                    <p>
                      Pour toute question concernant cette politique de confidentialité ou vos données personnelles :
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h5 className="font-medium">Délégué à la Protection des Données</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>dpo@locasimple.com</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>📍</span>
                            <span>123 Rue de la Tech, 75001 Paris, France</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h5 className="font-medium">Support Client</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>support@locasimple.com</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span>📞</span>
                            <span>+33 1 23 45 67 89</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                      <Button className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>Formulaire de Contact</span>
                      </Button>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Télécharger mes données</span>
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-teal-50 dark:from-gray-800 dark:to-gray-700 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Modifications de cette Politique</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. 
                Les modifications importantes vous seront notifiées par e-mail ou via l'application. 
                Nous vous encourageons à consulter régulièrement cette page.
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
