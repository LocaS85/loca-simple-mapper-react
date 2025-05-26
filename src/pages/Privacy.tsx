
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import RouteBackButton from '@/components/ui/RouteBackButton';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Mail, MapPin, Shield, Cookie, Eye, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Privacy = () => {
  const [openSections, setOpenSections] = useState<string[]>(['intro']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const sections = [
    {
      id: 'collection',
      title: 'Collecte des données',
      icon: <Eye className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p>Nous collectons les types de données suivantes :</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                Données de géolocalisation
              </h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Position GPS (avec votre consentement)</li>
                <li>• Adresses recherchées</li>
                <li>• Historique des trajets calculés</li>
              </ul>
            </div>
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold flex items-center mb-2">
                <Mail className="h-4 w-4 mr-2 text-green-600" />
                Informations personnelles
              </h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Adresse e-mail</li>
                <li>• Nom complet (optionnel)</li>
                <li>• Préférences utilisateur</li>
              </ul>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            <strong>Base légale :</strong> Article 6(1)(a) du RGPD (consentement) et Article 6(1)(b) (exécution du contrat).
          </p>
        </div>
      )
    },
    {
      id: 'usage',
      title: 'Utilisation des données',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p>Vos données sont utilisées pour :</p>
          <div className="space-y-3">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Fonctionnement du service</h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Calcul des itinéraires et recherches géographiques</li>
                <li>• Sauvegarde de vos préférences et favoris</li>
                <li>• Authentification et sécurité du compte</li>
              </ul>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Amélioration de l'expérience</h4>
              <ul className="text-sm mt-2 space-y-1">
                <li>• Personnalisation des résultats de recherche</li>
                <li>• Analyse anonymisée des tendances d'utilisation</li>
                <li>• Optimisation des performances de l'application</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sharing',
      title: 'Partage avec des tiers',
      icon: <Lock className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">Principe général</h4>
            <p className="text-sm mt-2">
              Nous ne vendons jamais vos données personnelles. Le partage est limité aux cas suivants :
            </p>
          </div>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">Prestataires de services :</h4>
              <ul className="text-sm mt-1 space-y-1 text-gray-600">
                <li>• Services de cartographie (données anonymisées)</li>
                <li>• Hébergement sécurisé (Supabase/AWS)</li>
                <li>• Traitement des paiements (Stripe - données chiffrées)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Obligations légales :</h4>
              <p className="text-sm text-gray-600 mt-1">
                Uniquement sur demande judiciaire ou administrative légalement fondée.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'rights',
      title: 'Vos droits',
      icon: <Shield className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">Droit d'accès</h4>
                <p className="text-sm text-gray-600">Consultez toutes les données que nous détenons sur vous</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">Droit de rectification</h4>
                <p className="text-sm text-gray-600">Modifiez ou corrigez vos informations</p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h4 className="font-semibold">Droit à l'effacement</h4>
                <p className="text-sm text-gray-600">Supprimez définitivement vos données</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold">Droit à la portabilité</h4>
                <p className="text-sm text-gray-600">Exportez vos données dans un format lisible</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">Droit d'opposition</h4>
                <p className="text-sm text-gray-600">Refusez certains traitements de données</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">Droit de limitation</h4>
                <p className="text-sm text-gray-600">Limitez l'utilisation de vos données</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Pour exercer ces droits :</strong> Contactez-nous à 
              <a href="mailto:privacy@locasimple.com" className="text-blue-600 hover:underline ml-1">
                privacy@locasimple.com
              </a>
              {' '}ou via notre{' '}
              <a href="/contact" className="text-blue-600 hover:underline">
                formulaire de contact
              </a>
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies et tracking',
      icon: <Cookie className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200">Cookies essentiels</h4>
              <p className="text-sm mt-2">Nécessaires au fonctionnement (authentification, préférences)</p>
              <p className="text-xs text-green-600 mt-1">🟢 Toujours actifs</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200">Cookies d'analyse</h4>
              <p className="text-sm mt-2">Mesure anonyme de l'audience et amélioration du service</p>
              <p className="text-xs text-blue-600 mt-1">🔵 Avec votre consentement</p>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Gérer vos préférences</h4>
            <p className="text-sm text-gray-600 mb-3">
              Vous pouvez à tout moment modifier vos préférences de cookies :
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Paramètres des cookies
              </Button>
              <Button variant="outline" size="sm">
                Tout refuser
              </Button>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: <Lock className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <p>Nous mettons en œuvre des mesures techniques et organisationnelles avancées :</p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <Lock className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">Chiffrement</h4>
              <p className="text-sm text-gray-600">SSL/TLS + chiffrement base de données</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Shield className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold">Accès contrôlé</h4>
              <p className="text-sm text-gray-600">Authentification multi-facteurs</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Eye className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold">Surveillance</h4>
              <p className="text-sm text-gray-600">Monitoring sécurité 24/7</p>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
            <h4 className="font-semibold text-red-800 dark:text-red-200">En cas de violation</h4>
            <p className="text-sm mt-2">
              Nous nous engageons à vous notifier dans les 72h et à informer les autorités compétentes (CNIL).
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'contact',
      title: 'Nous contacter',
      icon: <Mail className="h-5 w-5" />,
      content: (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Délégué à la protection des données</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <Mail className="h-4 w-4 inline mr-2" />
                    <a href="mailto:dpo@locasimple.com" className="text-blue-600 hover:underline">
                      dpo@locasimple.com
                    </a>
                  </p>
                  <p className="text-gray-600">Réponse sous 30 jours maximum</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Service client</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <Mail className="h-4 w-4 inline mr-2" />
                    <a href="mailto:support@locasimple.com" className="text-blue-600 hover:underline">
                      support@locasimple.com
                    </a>
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <a href="/contact">Formulaire de contact</a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Autorité de contrôle</h4>
                <p className="text-sm text-gray-600 mb-2">
                  En cas de litige, vous pouvez saisir la CNIL :
                </p>
                <div className="text-sm space-y-1">
                  <p>🏛️ Commission Nationale de l'Informatique et des Libertés</p>
                  <p>📧 www.cnil.fr</p>
                  <p>📞 01 53 73 22 22</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="mb-6">
            <RouteBackButton />
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Politique de Confidentialité</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold mb-3">Résumé de nos engagements</h2>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">🔒 Sécurité :</span> Vos données sont chiffrées et protégées
                </div>
                <div>
                  <span className="font-medium">🎯 Finalité :</span> Utilisées uniquement pour le service
                </div>
                <div>
                  <span className="font-medium">⚖️ Vos droits :</span> Accès, modification, suppression garantis
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {sections.map((section) => (
                <Collapsible 
                  key={section.id}
                  open={openSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <div className="flex items-center space-x-3">
                        {section.icon}
                        <h3 className="text-lg font-semibold text-left">{section.title}</h3>
                      </div>
                      {openSections.includes(section.id) ? 
                        <ChevronDown className="h-5 w-5" /> : 
                        <ChevronRight className="h-5 w-5" />
                      }
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 border-x border-b border-gray-200 dark:border-gray-700 rounded-b-lg">
                      {section.content}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border">
              <h3 className="text-lg font-semibold mb-3">Une question sur vos données ?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question.
              </p>
              <div className="flex gap-3">
                <Button>
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:privacy@locasimple.com">Nous contacter</a>
                </Button>
                <Button variant="outline">
                  <a href="/contact">Formulaire de contact</a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
