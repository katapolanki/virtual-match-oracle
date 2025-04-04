
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Loader2 } from "lucide-react";
import { MatchPrediction } from "@/data/virtualMatchesData";

interface TopPredictionsProps {
  isAnalyzing: boolean;
  analysisComplete: boolean;
  topPredictions: MatchPrediction[];
  roundNumber: string;
}

export const TopPredictions = ({ isAnalyzing, analysisComplete, topPredictions, roundNumber }: TopPredictionsProps) => {
  return (
    <>
      {analysisComplete ? (
        <>
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Elemzés kész</AlertTitle>
            <AlertDescription className="text-green-700">
              Az algoritmus sikeresen azonosította a 3 legvalószínűbb "mindkét csapat betalál" mérkőzést a {roundNumber}.
              fordulóban.
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
    </>
  );
};
