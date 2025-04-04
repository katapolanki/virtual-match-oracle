
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MatchPrediction, VirtualMatch } from "@/data/virtualMatchesData";

interface MatchTableProps {
  matches: VirtualMatch[];
  predictions: MatchPrediction[];
  topPredictions: MatchPrediction[];
}

export const MatchTable = ({ matches, predictions, topPredictions }: MatchTableProps) => {
  return (
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
          {matches.map((match) => {
            const prediction = predictions.find((p) => p.id === match.id);

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
                  {prediction && topPredictions.some((t) => t.id === prediction.id) ? (
                    <Badge variant="default">Igen</Badge>
                  ) : (
                    <Badge variant="outline">Nem</Badge>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
