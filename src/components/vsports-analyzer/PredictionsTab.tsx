
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { MatchPrediction } from "@/services/vsports/types";
import { TopPredictionCards } from "./TopPredictionCards";
import { PredictionsTable } from "./PredictionsTable";

interface PredictionsTabProps {
  isLoading: boolean;
  hasLoaded: boolean;
  predictions: MatchPrediction[];
  topPredictions: MatchPrediction[];
}

export const PredictionsTab = ({ 
  isLoading, 
  hasLoaded, 
  predictions, 
  topPredictions 
}: PredictionsTabProps) => {
  return (
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

              <TopPredictionCards topPredictions={topPredictions} />
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
            <PredictionsTable predictions={predictions} />
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
  );
};
