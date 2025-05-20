
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

export default function Index() {
  const { t } = useTranslation();
  
  const handleExplore = () => {
    toast.success("Commençons l'exploration !");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <Container>
            <div className="space-y-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {t('home.title')}
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                {t('home.subtitle')}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button asChild size="lg" onClick={handleExplore}>
                  <Link to="/geosearchapp">{t('home.startExplore')}</Link>
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
                      <Link to="/moderngeo">{t('home.modernSearch')}</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/geosearchapp">{t('home.fullApp')}</Link>
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
      <Footer />
    </div>
  );
}
