
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import RouteBackButton from '@/components/ui/RouteBackButton';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="mb-6">
            <RouteBackButton route="/" />
          </div>
          
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p>
                Cette politique de confidentialité décrit comment nous collectons, utilisons et 
                partageons vos informations personnelles lorsque vous utilisez notre application.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Collecte des données</h2>
              <p>
                Nous collectons plusieurs types d'informations à des fins diverses pour vous fournir 
                et améliorer notre service, notamment :
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Données personnelles (nom, adresse e-mail, etc.)</li>
                <li>Données de localisation (si vous nous donnez l'autorisation)</li>
                <li>Données d'utilisation et de préférences</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Utilisation des données</h2>
              <p>
                Les informations que nous collectons sont utilisées pour :
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Améliorer notre application</li>
                <li>Vous envoyer des mises à jour et des informations</li>
                <li>Respecter nos obligations légales</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Partage des données</h2>
              <p>
                Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager 
                certaines informations avec :
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Nos prestataires de services qui nous aident à faire fonctionner l'application</li>
                <li>Des autorités publiques si la loi l'exige</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Vos droits</h2>
              <p>
                Vous disposez de certains droits concernant vos données personnelles, notamment :
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Le droit d'accéder à vos données</li>
                <li>Le droit de rectifier vos données</li>
                <li>Le droit à l'effacement de vos données</li>
                <li>Le droit de limiter le traitement</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos 
                informations personnelles contre tout accès, modification, divulgation ou 
                destruction non autorisés.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p>
                Notre application peut utiliser des cookies pour améliorer votre expérience.
                Vous pouvez configurer votre navigateur pour refuser tous les cookies ou pour 
                indiquer quand un cookie est envoyé.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Modifications de la politique</h2>
              <p>
                Nous pouvons mettre à jour cette politique de confidentialité de temps à autre.
                Nous vous informerons de tout changement en publiant la nouvelle politique sur 
                cette page.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Nous contacter</h2>
              <p>
                Si vous avez des questions concernant cette politique de confidentialité,
                veuillez nous contacter à l'adresse suivante : contact@example.com
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
