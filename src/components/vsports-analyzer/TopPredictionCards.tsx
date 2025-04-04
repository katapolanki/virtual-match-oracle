
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MatchPrediction } from "@/services/vsports/types";

interface TopPredictionCardsProps {
  topPredictions: MatchPrediction[];
}

export const TopPredictionCards = ({ topPredictions }: TopPredictionCardsProps) => {
  return (
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
  );
};
