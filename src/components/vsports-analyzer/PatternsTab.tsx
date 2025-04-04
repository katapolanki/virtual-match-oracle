
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PatternFrequency } from "@/services/vsports/types";
import { PieChart, Zap } from "lucide-react";

interface PatternsTabProps {
  isLoading: boolean;
  hasLoaded: boolean;
  patternFrequencies: PatternFrequency[];
}

export const PatternsTab = ({ isLoading, hasLoaded, patternFrequencies }: PatternsTabProps) => {
  return (
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
  );
};
