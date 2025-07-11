
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useTranslations } from "@/hooks/useTranslations";
import { ErrorBoundary } from 'react-error-boundary';
import Logo from "@/components/ui/Logo";

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

  return (
    <ErrorBoundary FallbackComponent={HomeErrorFallback}>
      <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <Container>
            <div className="space-y-6 text-center">
              {/* Logo principal */}
              <div className="flex justify-center mb-8">
                <Logo size="lg" variant="primary" showText={true} />
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {t('home.title')}
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button asChild size="lg" onClick={handleExplore}>
                  <Link to="/geosearch">{t('home.startExplore')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/categories">{t('home.seeCategories')}</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">{t('home.features')}</h2>
                <p className="text-muted-foreground">
                  {t('home.featureDesc')}
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{t('home.featureList.maps')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{t('home.featureList.categorySearch')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{t('home.featureList.filter')}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>{t('home.featureList.favorites')}</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold">{t('home.mapViews')}</h3>
                  <div className="grid gap-4">
                    <Button asChild variant="secondary">
                      <Link to="/geosearch">{t('home.basicSearch')}</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/modern-search">{t('home.modernSearch')}</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/categories">{t('home.fullApp')}</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/favorites">{t('home.myFavorites')}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>
      </main>
    </div>
    </ErrorBoundary>
  );
}
