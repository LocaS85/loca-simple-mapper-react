
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function Index() {
  const handleExplore = () => {
    toast.success("Let's start exploring!");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
          <Container>
            <div className="space-y-6 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Loca Simple Mapper
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                A simple and powerful tool for mapping and exploring locations.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center">
                <Button asChild size="lg" onClick={handleExplore}>
                  <Link to="/geosearchapp">Start Exploring</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/categories">View Categories</Link>
                </Button>
              </div>
            </div>
          </Container>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features</h2>
                <p className="text-muted-foreground">
                  Our application provides various mapping and location search capabilities.
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Interactive maps with custom markers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Search for locations by category</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Filter search results</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Save favorite locations</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <h3 className="text-2xl font-bold">Available Map Views</h3>
                  <div className="grid gap-4">
                    <Button asChild variant="secondary">
                      <Link to="/geosearch">Basic GeoSearch</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/moderngeo">Modern GeoSearch</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/geosearchapp">Full GeoSearch App</Link>
                    </Button>
                    <Button asChild variant="secondary">
                      <Link to="/favorites">My Favorites</Link>
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
