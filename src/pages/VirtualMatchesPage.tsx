
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Loader2, TrendingUp, Goal, Shield } from "lucide-react"
import { EnigmaDecryptionSection } from "../components/enigma-decryption-section"

// Típusok definiálása
type VirtualMatch = {
  id: number
  date: string
  homeTeam: string
  awayTeam: string
  homeGoals?: number
  awayGoals?: number
}

type MatchPrediction = {
  id: number
  homeTeam: string
  awayTeam: string
  prediction: string
  odds: number
  confidence: number
  explanation: string
}

type TeamStats = {
  team: string
  matches: number
  goalsScored: number
  goalsConceded: number
  scoringRate: number
  concedingRate: number
}

// Virtuális mérkőzések adatai
const virtualMatches15: VirtualMatch[] = [
  { id: 1, date: "05:59", homeTeam: "Brighton", awayTeam: "Brentford" },
  { id: 2, date: "05:59", homeTeam: "Wolverhampton", awayTeam: "Chelsea" },
  { id: 3, date: "05:59", homeTeam: "Newcastle", awayTeam: "Aston Oroszlán" },
  { id: 4, date: "05:59", homeTeam: "Fulham", awayTeam: "London Ágyúk" },
  { id: 5, date: "05:59", homeTeam: "Tottenham", awayTeam: "Crystal Palace" },
  { id: 6, date: "05:59", homeTeam: "Liverpool", awayTeam: "Nottingham" },
  { id: 7, date: "05:59", homeTeam: "Everton", awayTeam: "West Ham" },
  { id: 8, date: "05:59", homeTeam: "Manchester Kék", awayTeam: "Vidéki Oroszlánok" },
]

const virtualMatches16: VirtualMatch[] = [
  { id: 9, date: "06:06", homeTeam: "Brighton", awayTeam: "Aston Oroszlán" },
  { id: 10, date: "06:06", homeTeam: "Fulham", awayTeam: "Crystal Palace" },
  { id: 11, date: "06:06", homeTeam: "Manchester Kék", awayTeam: "London Ágyúk" },
  { id: 12, date: "06:06", homeTeam: "Tottenham", awayTeam: "Chelsea" },
  { id: 13, date: "06:06", homeTeam: "Everton", awayTeam: "Brentford" },
  { id: 14, date: "06:06", homeTeam: "West Ham", awayTeam: "Liverpool" },
  { id: 15, date: "06:06", homeTeam: "Wolverhampton", awayTeam: "Nottingham" },
  { id: 16, date: "06:06", homeTeam: "Newcastle", awayTeam: "Vidéki Oroszlánok" },
]

// Szimulált történelmi adatok a csapatokról
const teamStatsData: TeamStats[] = [
  { team: "Liverpool", matches: 100, goalsScored: 180, goalsConceded: 70, scoringRate: 1.8, concedingRate: 0.7 },
  { team: "Manchester Kék", matches: 100, goalsScored: 175, goalsConceded: 75, scoringRate: 1.75, concedingRate: 0.75 },
  { team: "Chelsea", matches: 100, goalsScored: 160, goalsConceded: 80, scoringRate: 1.6, concedingRate: 0.8 },
  { team: "Tottenham", matches: 100, goalsScored: 155, goalsConceded: 90, scoringRate: 1.55, concedingRate: 0.9 },
  { team: "London Ágyúk", matches: 100, goalsScored: 150, goalsConceded: 95, scoringRate: 1.5, concedingRate: 0.95 },
  { team: "West Ham", matches: 100, goalsScored: 130, goalsConceded: 110, scoringRate: 1.3, concedingRate: 1.1 },
  { team: "Brighton", matches: 100, goalsScored: 125, goalsConceded: 115, scoringRate: 1.25, concedingRate: 1.15 },
  { team: "Newcastle", matches: 100, goalsScored: 120, goalsConceded: 120, scoringRate: 1.2, concedingRate: 1.2 },
  {
    team: "Aston Oroszlán",
    matches: 100,
    goalsScored: 115,
    goalsConceded: 125,
    scoringRate: 1.15,
    concedingRate: 1.25,
  },
  { team: "Brentford", matches: 100, goalsScored: 110, goalsConceded: 130, scoringRate: 1.1, concedingRate: 1.3 },
  {
    team: "Crystal Palace",
    matches: 100,
    goalsScored: 105,
    goalsConceded: 135,
    scoringRate: 1.05,
    concedingRate: 1.35,
  },
  { team: "Wolverhampton", matches: 100, goalsScored: 100, goalsConceded: 140, scoringRate: 1.0, concedingRate: 1.4 },
  { team: "Everton", matches: 100, goalsScored: 95, goalsConceded: 145, scoringRate: 0.95, concedingRate: 1.45 },
  { team: "Fulham", matches: 100, goalsScored: 90, goalsConceded: 150, scoringRate: 0.9, concedingRate: 1.5 },
  {
    team: "Vidéki Oroszlánok",
    matches: 100,
    goalsScored: 85,
    goalsConceded: 155,
    scoringRate: 0.85,
    concedingRate: 1.55,
  },
  { team: "Nottingham", matches: 100, goalsScored: 80, goalsConceded: 160, scoringRate: 0.8, concedingRate: 1.6 },
]

// Szimulált egymás elleni statisztikák - mindkét csapat gólt szerzett százalékban
const headToHeadBTTSPercentage: Record<string, number> = {
  "Brighton-Brentford": 65,
  "Wolverhampton-Chelsea": 55,
  "Newcastle-Aston Oroszlán": 70,
  "Fulham-London Ágyúk": 60,
  "Tottenham-Crystal Palace": 75,
  "Liverpool-Nottingham": 50,
  "Everton-West Ham": 80,
  "Manchester Kék-Vidéki Oroszlánok": 60,
  "Brighton-Aston Oroszlán": 75,
  "Fulham-Crystal Palace": 65,
  "Manchester Kék-London Ágyúk": 85,
  "Tottenham-Chelsea": 80,
  "Everton-Brentford": 70,
  "West Ham-Liverpool": 75,
  "Wolverhampton-Nottingham": 55,
  "Newcastle-Vidéki Oroszlánok": 60,
}

export default function VirtualMatchesPage() {
  const [activeTab, setActiveTab] = useState("round15")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [predictions15, setPredictions15] = useState<MatchPrediction[]>([])
  const [predictions16, setPredictions16] = useState<MatchPrediction[]>([])
  const [topPredictions15, setTopPredictions15] = useState<MatchPrediction[]>([])
  const [topPredictions16, setTopPredictions16] = useState<MatchPrediction[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)

  // Predikciók generálása
  const generatePredictions = () => {
    setIsAnalyzing(true)

    // Időzítés a lépésenkénti elemzés szimulálásához
    setTimeout(() => {
      const predictions15 = calculatePredictions(virtualMatches15)
      const predictions16 = calculatePredictions(virtualMatches16)

      setPredictions15(predictions15)
      setPredictions16(predictions16)

      // Top 3 predikció kiválasztása
      setTopPredictions15(predictions15.slice(0, 3))
      setTopPredictions16(predictions16.slice(0, 3))

      setIsAnalyzing(false)
      setAnalysisComplete(true)
    }, 1500)
  }

  // Predikciók kiszámítása
  const calculatePredictions = (matches: VirtualMatch[]): MatchPrediction[] => {
    const predictions: MatchPrediction[] = []

    matches.forEach((match) => {
      const homeTeamStats = teamStatsData.find((t) => t.team === match.homeTeam)
      const awayTeamStats = teamStatsData.find((t) => t.team === match.awayTeam)

      if (!homeTeamStats || !awayTeamStats) return

      // Mindkét csapat betalál valószínűség kiszámítása
      let bothTeamsScoredProb = 0
      let explanation = ""

      // 1. Egymás elleni mérkőzések alapján
      const h2hKey = `${match.homeTeam}-${match.awayTeam}`
      const h2hBTTSPercentage = headToHeadBTTSPercentage[h2hKey] || 50

      bothTeamsScoredProb += h2hBTTSPercentage * 0.6 // 60% súly az egymás elleni mérkőzéseknek
      explanation = `A ${match.homeTeam} és a ${match.awayTeam} közötti mérkőzések ${h2hBTTSPercentage}%-ában mindkét csapat betalált.`

      // 2. Csapatok gólszerzési képessége alapján
      if (homeTeamStats.scoringRate >= 1.0 && awayTeamStats.scoringRate >= 0.8) {
        bothTeamsScoredProb += 20 // Növeljük a valószínűséget
        explanation += ` A ${match.homeTeam} átlagosan ${homeTeamStats.scoringRate.toFixed(1)} gólt szerez, a ${match.awayTeam} pedig ${awayTeamStats.scoringRate.toFixed(1)} gólt meccsenként.`
      }

      // 3. Csapatok védekezési képessége alapján
      if (homeTeamStats.concedingRate >= 0.8 && awayTeamStats.concedingRate >= 1.0) {
        bothTeamsScoredProb += 20 // Növeljük a valószínűséget
        explanation += ` A ${match.homeTeam} átlagosan ${homeTeamStats.concedingRate.toFixed(1)} gólt kap, a ${match.awayTeam} pedig ${awayTeamStats.concedingRate.toFixed(1)} gólt meccsenként.`
      }

      // Normalizáljuk a valószínűséget 0-100 közé
      bothTeamsScoredProb = Math.min(Math.max(bothTeamsScoredProb, 0), 100)

      // Odds kiszámítása a valószínűség alapján (inverz kapcsolat)
      let odds = 0
      if (bothTeamsScoredProb > 0) {
        odds = 100 / bothTeamsScoredProb
        odds = Math.max(Math.min(odds, 5), 1.3) // Korlátozzuk 1.3 és 5 közé
      } else {
        odds = 3.0 // Alapértelmezett odds, ha nincs elég adat
      }

      predictions.push({
        id: match.id,
        homeTeam: match.homeTeam,
        awayTeam: match.awayTeam,
        prediction: "Mindkét csapat betalál",
        odds: Number.parseFloat(odds.toFixed(2)),
        confidence: Number.parseFloat(bothTeamsScoredProb.toFixed(0)),
        explanation,
      })
    })

    // Rendezés megbízhatóság szerint
    return predictions.sort((a, b) => b.confidence - a.confidence)
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2 text-center">Virtuális Labdarúgás Liga Elemző</h1>
      <p className="text-center text-muted-foreground mb-8">
        Mindkét csapat betalál predikciók a Virtuális Labdarúgás Liga Mod Retail 20319 mérkőzéseire
      </p>

      <div className="flex justify-center mb-6">
        <Button onClick={generatePredictions} disabled={isAnalyzing || analysisComplete} className="w-64">
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Elemzés folyamatban...
            </>
          ) : analysisComplete ? (
            "Elemzés kész"
          ) : (
            "Mérkőzések elemzése"
          )}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="round15">15. Forduló (05:59)</TabsTrigger>
          <TabsTrigger value="round16">16. Forduló (06:06)</TabsTrigger>
          <TabsTrigger value="enigma">Enigma Feltörés</TabsTrigger>
        </TabsList>

        {/* 15. Forduló */}
        <TabsContent value="round15">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 3 "Mindkét csapat betalál" Tipp - 15. Forduló</CardTitle>
                <CardDescription>A legnagyobb valószínűséggel bekövetkező kimenetel</CardDescription>
              </CardHeader>
              <CardContent>
                {analysisComplete ? (
                  <>
                    <Alert className="mb-6 bg-green-50 border-green-200">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Elemzés kész</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Az algoritmus sikeresen azonosította a 3 legvalószínűbb "mindkét csapat betalál" mérkőzést a 15.
                        fordulóban.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {topPredictions15.map((tip) => (
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
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Adatok elemzése...</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Kattints a "Mérkőzések elemzése" gombra a predikciók generálásához
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>15. Forduló Mérkőzései</CardTitle>
                <CardDescription>Összes mérkőzés és predikció</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Időpont</TableHead>
                        <TableHead>Hazai</TableHead>
                        <TableHead>Vendég</TableHead>
                        <TableHead>Tipp</TableHead>
                        <TableHead>Odds</TableHead>
                        <TableHead>Megbízhatóság</TableHead>
                        <TableHead>Top 3</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {virtualMatches15.map((match) => {
                        const prediction = predictions15.find((p) => p.id === match.id)

                        return (
                          <TableRow key={match.id}>
                            <TableCell>{match.date}</TableCell>
                            <TableCell className="font-medium">{match.homeTeam}</TableCell>
                            <TableCell>{match.awayTeam}</TableCell>
                            <TableCell>{prediction?.prediction || "-"}</TableCell>
                            <TableCell>{prediction?.odds || "-"}</TableCell>
                            <TableCell>
                              {prediction ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={prediction.confidence} className="w-[80px] h-2" />
                                  <span>{prediction.confidence}%</span>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {prediction && topPredictions15.some((t) => t.id === prediction.id) ? (
                                <Badge variant="default">Igen</Badge>
                              ) : (
                                <Badge variant="outline">Nem</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 16. Forduló */}
        <TabsContent value="round16">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 3 "Mindkét csapat betalál" Tipp - 16. Forduló</CardTitle>
                <CardDescription>A legnagyobb valószínűséggel bekövetkező kimenetel</CardDescription>
              </CardHeader>
              <CardContent>
                {analysisComplete ? (
                  <>
                    <Alert className="mb-6 bg-green-50 border-green-200">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Elemzés kész</AlertTitle>
                      <AlertDescription className="text-green-700">
                        Az algoritmus sikeresen azonosította a 3 legvalószínűbb "mindkét csapat betalál" mérkőzést a 16.
                        fordulóban.
                      </AlertDescription>
                    </Alert>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {topPredictions16.map((tip) => (
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
                    {isAnalyzing ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Adatok elemzése...</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        Kattints a "Mérkőzések elemzése" gombra a predikciók generálásához
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>16. Forduló Mérkőzései</CardTitle>
                <CardDescription>Összes mérkőzés és predikció</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Időpont</TableHead>
                        <TableHead>Hazai</TableHead>
                        <TableHead>Vendég</TableHead>
                        <TableHead>Tipp</TableHead>
                        <TableHead>Odds</TableHead>
                        <TableHead>Megbízhatóság</TableHead>
                        <TableHead>Top 3</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {virtualMatches16.map((match) => {
                        const prediction = predictions16.find((p) => p.id === match.id)

                        return (
                          <TableRow key={match.id}>
                            <TableCell>{match.date}</TableCell>
                            <TableCell className="font-medium">{match.homeTeam}</TableCell>
                            <TableCell>{match.awayTeam}</TableCell>
                            <TableCell>{prediction?.prediction || "-"}</TableCell>
                            <TableCell>{prediction?.odds || "-"}</TableCell>
                            <TableCell>
                              {prediction ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={prediction.confidence} className="w-[80px] h-2" />
                                  <span>{prediction.confidence}%</span>
                                </div>
                              ) : (
                                "-"
                              )}
                            </TableCell>
                            <TableCell>
                              {prediction && topPredictions16.some((t) => t.id === prediction.id) ? (
                                <Badge variant="default">Igen</Badge>
                              ) : (
                                <Badge variant="outline">Nem</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Enigma Feltörés */}
        <TabsContent value="enigma">
          <EnigmaDecryptionSection />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Elemzési Módszertan</CardTitle>
          <CardDescription>Hogyan határozzuk meg a "mindkét csapat betalál" valószínűségét</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <h3 className="font-medium">Egymás elleni mérkőzések</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Az algoritmus elemzi a csapatok egymás elleni mérkőzéseit, és kiszámítja, hogy ezeken a mérkőzéseken
                milyen arányban talált be mindkét csapat. Ez a legfontosabb tényező, 60% súllyal szerepel a végső
                valószínűség kiszámításában.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <Goal className="h-5 w-5 text-green-500" />
                <h3 className="font-medium">Gólszerzési képesség</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Figyelembe vesszük a csapatok átlagos gólszerzési képességét. Ha a hazai csapat átlagosan legalább 1.0
                gólt szerez, a vendég csapat pedig legalább 0.8 gólt meccsenként, az növeli a "mindkét csapat betalál"
                valószínűségét.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-red-500" />
                <h3 className="font-medium">Védekezési képesség</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                A csapatok védekezési képességét is elemezzük. Ha a hazai csapat átlagosan legalább 0.8 gólt kap, a
                vendég csapat pedig legalább 1.0 gólt meccsenként, az szintén növeli a "mindkét csapat betalál"
                valószínűségét.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
