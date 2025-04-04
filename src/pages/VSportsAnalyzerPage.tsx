
"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  AlertCircle, 
  Loader2, 
  TrendingUp, 
  Goal, 
  Shield, 
  BarChart4, 
  PieChart, 
  Zap 
} from "lucide-react";
import { 
  fetchData, 
  MatchPrediction, 
  TeamStats, 
  PatternFrequency, 
  CurrentMatch 
} from "../services/vsportsService";

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

        {/* Predikciók Tab */}
        <TabsContent value="predictions">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 3 Predikció</CardTitle>
                <CardDescription>A legmagasabb megbízhatóságú predikciók</CardDescription>
              </CardHeader>
              <CardContent>
                {hasLoaded ? (
                  <>
                    <Alert className="mb-6 bg-green-50 border-green-200">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Enigma kód feltörve!</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Az algoritmus sikeresen azonosította a V-Sports bajnokság mintázatait és a legvalószínűbb kimeneteleket.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {topPredictions.map((tip) => (
                        <div key={tip.id} className="p-4 border rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">
                              {tip.homeTeam} - {tip.awayTeam}
                            </span>
                            <Badge>{tip.odds}x</Badge>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-medium">Tipp: </span>
                            <span className="text-sm">{tip.prediction}</span>
                          </div>
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Megbízhatóság:</span>
                              <span>{tip.confidence}%</span>
                            </div>
                            <Progress value={tip.confidence} className="h-2" />
                          </div>
                          <div className="mb-2">
                            <span className="text-sm font-medium">Mintázat: </span>
                            <span className="text-sm">{tip.pattern}</span>
                          </div>
                          <div className="p-2 bg-muted rounded-md text-sm">
                            <p className="font-medium mb-1">Indoklás:</p>
                            <p className="text-muted-foreground">{tip.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    {isLoading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Adatok elemzése és mintázatok feltárása...</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Kattints az "Adatok elemzése" gombra a predikciók generálásához
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Összes predikció</CardTitle>
                <CardDescription>Az aktuális forduló összes mérkőzésének predikciója</CardDescription>
              </CardHeader>
              <CardContent>
                {hasLoaded ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Hazai</TableHead>
                          <TableHead>Vendég</TableHead>
                          <TableHead>Predikció</TableHead>
                          <TableHead>Odds</TableHead>
                          <TableHead>Megbízhatóság</TableHead>
                          <TableHead>Mintázat</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {predictions.map((prediction) => (
                          <TableRow key={prediction.id}>
                            <TableCell className="font-medium">{prediction.homeTeam}</TableCell>
                            <TableCell>{prediction.awayTeam}</TableCell>
                            <TableCell>{prediction.prediction}</TableCell>
                            <TableCell>{prediction.odds}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={prediction.confidence} className="w-[80px] h-2" />
                                <span>{prediction.confidence}%</span>
                              </div>
                            </TableCell>
                            <TableCell>{prediction.pattern}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">
                      Elemezd az adatokat a predikciók megtekintéséhez
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Mintázatok Tab */}
        <TabsContent value="patterns">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Azonosított mintázatok</CardTitle>
                <CardDescription>A V-Sports bajnokság főbb mintázatai gyakoriság szerint</CardDescription>
              </CardHeader>
              <CardContent>
                {hasLoaded ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {patternFrequencies.map((pattern, index) => (
                        <div key={index} className="p-4 border rounded-md">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <PieChart className="h-5 w-5 text-primary" />
                              <h3 className="font-medium">{pattern.pattern}</h3>
                            </div>
                            <Badge variant="outline">{pattern.count} mérkőzés</Badge>
                          </div>
                          <div className="mb-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Gyakoriság:</span>
                              <span>{pattern.percentage.toFixed(1)}%</span>
                            </div>
                            <Progress value={pattern.percentage} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border rounded-md bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="h-5 w-5 text-amber-500" />
                        <h3 className="font-medium">Enigma kód feltárása</h3>
                      </div>
                      <p className="text-muted-foreground">
                        Az elemzés feltárta a V-Sports bajnokság 4 fő mintázatát:
                      </p>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <span className="font-medium">1. Papírforma:</span> A csapatok az általános erősségüknek megfelelően szerepelnek.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium">2. Fordított:</span> Az esélytelenebb csapat jobban szerepel a vártnál.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium">3. Félidő/Végeredmény:</span> A félidei és a végeredmény között jelentős változás történik.
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="font-medium">4. Kiszámíthatatlan:</span> Váratlan eredmény, amely nem illeszkedik a korábbi mintázatokba.
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">
                      Elemezd az adatokat a mintázatok megtekintéséhez
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Statisztikák Tab */}
        <TabsContent value="statistics">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Csapat statisztikák</CardTitle>
                <CardDescription>Csapatok teljesítménye a történelmi adatok alapján</CardDescription>
              </CardHeader>
              <CardContent>
                {hasLoaded ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Csapat</TableHead>
                          <TableHead>Mérkőzések</TableHead>
                          <TableHead>Győzelmek</TableHead>
                          <TableHead>Döntetlenek</TableHead>
                          <TableHead>Vereségek</TableHead>
                          <TableHead>Lőtt gólok</TableHead>
                          <TableHead>Kapott gólok</TableHead>
                          <TableHead>Győzelmi %</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {teamStats.slice(0, 10).map((team, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{team.team}</TableCell>
                            <TableCell>{team.matches}</TableCell>
                            <TableCell>{team.wins}</TableCell>
                            <TableCell>{team.draws}</TableCell>
                            <TableCell>{team.losses}</TableCell>
                            <TableCell>{team.goalsFor}</TableCell>
                            <TableCell>{team.goalsAgainst}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Progress value={team.winPercentage} className="w-[80px] h-2" />
                                <span>{team.winPercentage.toFixed(1)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[300px]">
                    <p className="text-muted-foreground">
                      Elemezd az adatokat a statisztikák megtekintéséhez
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aktuális forduló mérkőzései</CardTitle>
                <CardDescription>Az aktuális forduló nyers adatai</CardDescription>
              </CardHeader>
              <CardContent>
                {hasLoaded ? (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Időpont</TableHead>
                          <TableHead>Hazai csapat</TableHead>
                          <TableHead>Vendég csapat</TableHead>
                          <TableHead>Félidő</TableHead>
                          <TableHead>Végeredmény</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentMatches.map((match, index) => (
                          <TableRow key={index}>
                            <TableCell>{match.időpont}</TableCell>
                            <TableCell className="font-medium">{match.hazaiCsapat}</TableCell>
                            <TableCell>{match.vendégCsapat}</TableCell>
                            <TableCell>
                              {match.félidőHazaiGól || "-"} - {match.félidőVendégGól || "-"}
                            </TableCell>
                            <TableCell>
                              {match.végeredményHazaiGól || "-"} - {match.végeredményVendégGól || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[200px]">
                    <p className="text-muted-foreground">
                      Elemezd az adatokat a mérkőzések megtekintéséhez
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Enigma Feltörési Módszertan</CardTitle>
          <CardDescription>Hogyan elemezzük a V-Sports mintázatait</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Történelmi adatelemzés</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Az algoritmus több ezer korábbi mérkőzés adatait dolgozza fel, és azonosítja a leggyakoribb 
                mintázatokat, kimeneteleket és összefüggéseket a különböző fogadási piacokra vonatkozóan.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <BarChart4 className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Csapat profilozás</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Minden csapatról részletes profilt készítünk, amely tartalmazza a győzelmi arányt, gólszerzési és kapott 
                gól statisztikákat, valamint az egymás elleni mérkőzések kimeneteleit és mintázatait.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Mintázat azonosítás</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A V-Sports bajnokságban 4 fő mintázatot azonosítottunk: Papírforma, Fordított, Félidő/Végeredmény és Kiszámíthatatlan.
                Az algoritmus minden mérkőzést besorol valamelyik mintázatba a történelmi adatok alapján.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
