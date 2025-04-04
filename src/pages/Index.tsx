
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import VirtualMatchesPage from "./VirtualMatchesPage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div>
      <div className="container mx-auto py-4">
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-bold text-primary">
              <Sparkles className="mr-2 h-5 w-5" />
              Új funkció: V-Sports Enigma Analyzer
            </CardTitle>
            <CardDescription>
              Mesterséges intelligencia által vezérelt "Mindkét csapat betalál" predikciók
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Fedezd fel az új V-Sports Enigma Analyzert, amely elemzi a történelmi adatokat és
              megbízható "Mindkét csapat betalál" predikciókat készít a V-Sports mérkőzésekre.
            </p>
            <Button asChild className="flex items-center">
              <Link to="/vsports-analyzer">
                Kipróbálom most <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex justify-end mb-4">
          <Button asChild variant="outline">
            <Link to="/vsports-analyzer">V-Sports Enigma Analyzer</Link>
          </Button>
        </div>
      </div>
      <VirtualMatchesPage />
    </div>
  );
};

export default Index;
