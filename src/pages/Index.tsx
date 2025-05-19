
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Index() {
  const handleExplore = () => {
    toast.success("Commençons l'exploration !");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <Container>
            <div className="space-y-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                LocaSimple
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Un outil simple et puissant pour cartographier et explorer des lieux.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button asChild size="lg" onClick={handleExplore}>
                  <Link to="/geosearchapp">Commencer l'exploration</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/categories">Voir les catégories</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Fonctionnalités</h2>
                <p className="text-muted-foreground">
                  Notre application propose diverses capacités de cartographie et de recherche de lieux.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Cartes interactives avec marqueurs personnalisés</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Recherche de lieux par catégorie</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Filtrage des résultats de recherche</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Enregistrement des lieux favoris</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold">Vues de carte disponibles</h3>
                  <div className="grid gap-4">
                    <Button asChild variant="secondary">
                      <Link to="/geosearch">Recherche géographique basique</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/moderngeo">Recherche géographique moderne</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/geosearchapp">Application complète de recherche</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/favorites">Mes favoris</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}

