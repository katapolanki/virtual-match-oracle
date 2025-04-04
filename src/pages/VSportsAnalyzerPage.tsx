
"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { 
  fetchData, 
  MatchPrediction, 
  TeamStats, 
  PatternFrequency, 
  CurrentMatch 
} from "@/services/vsportsService";
import { PredictionsTab } from "@/components/vsports-analyzer/PredictionsTab";
import { PatternsTab } from "@/components/vsports-analyzer/PatternsTab";
import { StatisticsTab } from "@/components/vsports-analyzer/StatisticsTab";
import { MethodologyCards } from "@/components/vsports-analyzer/MethodologyCards";

export default function VSportsAnalyzerPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("predictions");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [topPredictions, setTopPredictions] = useState<MatchPrediction[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats[]>([]);
  const [patternFrequencies, setPatternFrequencies] = useState<PatternFrequency[]>([]);
  const [currentMatches, setCurrentMatches] = useState<CurrentMatch[]>([]);

  const analyzeData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchData();
      
      // Set the data with a slight delay to simulate processing
      setTimeout(() => {
        setPredictions(data.predictions);
        setTopPredictions(data.predictions.slice(0, 3));
        setTeamStats(data.teamStats);
        setPatternFrequencies(data.patternFrequencies);
        setCurrentMatches(data.currentRoundData);
        setIsLoading(false);
        setHasLoaded(true);
        
        toast({
          title: "Elemzés sikeres",
          description: "Az V-Sports Enigma Analyzer sikeresen elemezte az adatokat.",
        });
      }, 1500);
    } catch (error) {
      console.error("Hiba történt az adatok elemzése során:", error);
      setIsLoading(false);
      toast({
        title: "Hiba történt",
        description: "Az adatok elemzése során hiba történt. Kérjük, próbálja újra később.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">V-Sports Enigma Analyzer</h1>
      <p className="text-center text-muted-foreground mb-8">
        Fejlett elemzési rendszer a V-Sports virtuális bajnokság mintázatainak feltörésére
      </p>

      <div className="flex justify-center mb-6">
        <Button onClick={analyzeData} disabled={isLoading} className="w-64">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adatok elemzése...
            </>
          ) : hasLoaded ? (
            "Elemzés frissítése"
          ) : (
            "Adatok elemzése"
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="predictions">Predikciók</TabsTrigger>
          <TabsTrigger value="patterns">Mintázatok</TabsTrigger>
          <TabsTrigger value="statistics">Statisztikák</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions">
          <PredictionsTab 
            isLoading={isLoading} 
            hasLoaded={hasLoaded}
            predictions={predictions}
            topPredictions={topPredictions}
          />
        </TabsContent>

        <TabsContent value="patterns">
          <PatternsTab 
            isLoading={isLoading} 
            hasLoaded={hasLoaded}
            patternFrequencies={patternFrequencies}
          />
        </TabsContent>

        <TabsContent value="statistics">
          <StatisticsTab 
            isLoading={isLoading} 
            hasLoaded={hasLoaded}
            teamStats={teamStats}
            currentMatches={currentMatches}
          />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Enigma Feltörési Módszertan</CardTitle>
          <CardDescription>Hogyan elemezzük a V-Sports mintázatait</CardDescription>
        </CardHeader>
        <CardContent>
          <MethodologyCards />
        </CardContent>
      </Card>
    </div>
  );
}
