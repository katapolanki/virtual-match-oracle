
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { EnigmaDecryptionSection } from "../components/enigma-decryption-section"
import { calculatePredictions } from "@/services/virtualPredictionService"
import { virtualMatches15, virtualMatches16 } from "@/data/virtualMatchesData"
import { TopPredictions } from "@/components/match-prediction/TopPredictions"
import { MatchTable } from "@/components/match-prediction/MatchTable"
import { MethodologySection } from "@/components/match-prediction/MethodologySection"
import { MatchPrediction } from "@/data/virtualMatchesData"

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
                <TopPredictions 
                  isAnalyzing={isAnalyzing}
                  analysisComplete={analysisComplete}
                  topPredictions={topPredictions15}
                  roundNumber="15"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>15. Forduló Mérkőzései</CardTitle>
                <CardDescription>Összes mérkőzés és predikció</CardDescription>
              </CardHeader>
              <CardContent>
                <MatchTable 
                  matches={virtualMatches15}
                  predictions={predictions15}
                  topPredictions={topPredictions15}
                />
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
                <TopPredictions 
                  isAnalyzing={isAnalyzing}
                  analysisComplete={analysisComplete}
                  topPredictions={topPredictions16}
                  roundNumber="16"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>16. Forduló Mérkőzései</CardTitle>
                <CardDescription>Összes mérkőzés és predikció</CardDescription>
              </CardHeader>
              <CardContent>
                <MatchTable 
                  matches={virtualMatches16}
                  predictions={predictions16}
                  topPredictions={topPredictions16}
                />
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
        <MethodologySection />
      </Card>
    </div>
  )
}
