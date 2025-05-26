import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Container } from '@/components/ui/container';
import RouteBackButton from '@/components/ui/RouteBackButton';

const TermsOfService = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-12">
        <Container>
          <div className="mb-6">
            <RouteBackButton />
          </div>
          
          <div className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none">
            <h1 className="text-3xl font-bold mb-6">Conditions Générales d'Utilisation</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
              <p>
                En accédant à cette application ou en l'utilisant, vous acceptez d'être lié par ces 
                conditions d'utilisation. Si vous n'acceptez pas l'intégralité de ces conditions,
                vous ne pouvez pas accéder au site web ni utiliser aucun service.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Modifications</h2>
              <p>
                Nous nous réservons le droit de modifier ces conditions à tout moment.
                Les modifications entreront en vigueur dès leur publication sur cette page.
                Votre utilisation continue de l'application après la publication des modifications 
                constitue votre acceptation des nouvelles conditions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Utilisation de l'application</h2>
              <p>
                Vous acceptez d'utiliser l'application uniquement à des fins légitimes et conformément
                aux présentes conditions et à toutes les lois et réglementations applicables.
              </p>
              <p className="mt-4">
                Vous ne pouvez pas :
              </p>
              <ul className="list-disc pl-6 mt-4">
                <li>Utiliser l'application d'une manière qui pourrait l'endommager ou compromettre son fonctionnement</li>
                <li>Accéder sans autorisation à nos systèmes ou à ceux de nos partenaires</li>
                <li>Collecter des données de notre application par des moyens automatisés</li>
                <li>Utiliser notre application pour transmettre du matériel publicitaire non sollicité</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Comptes utilisateurs</h2>
              <p>
                Lorsque vous créez un compte, vous devez fournir des informations exactes et complètes.
                Vous êtes responsable de la protection de votre mot de passe et de toutes les activités
                qui se produisent sous votre compte.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Propriété intellectuelle</h2>
              <p>
                Le contenu de l'application, y compris, mais sans s'y limiter, les textes, graphiques,
                logos, images, ainsi que leur compilation, sont la propriété de notre entreprise
                et sont protégés par les lois sur la propriété intellectuelle.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Limitation de responsabilité</h2>
              <p>
                Dans la mesure maximale permise par la loi, nous ne serons pas responsables des dommages
                directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation
                ou de l'impossibilité d'utiliser notre application.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Indemnisation</h2>
              <p>
                Vous acceptez d'indemniser et de dégager de toute responsabilité notre entreprise
                et ses dirigeants, administrateurs, employés et agents contre toutes réclamations,
                responsabilités, dommages, pertes et dépenses résultant de votre violation de ces conditions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Loi applicable</h2>
              <p>
                Ces conditions sont régies et interprétées conformément aux lois françaises,
                sans égard aux principes de conflits de lois.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p>
                Pour toute question concernant ces conditions d'utilisation,
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

export default TermsOfService;
