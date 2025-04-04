
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { MatchPrediction } from "@/services/vsports/types";

interface PredictionsTableProps {
  predictions: MatchPrediction[];
}

export const PredictionsTable = ({ predictions }: PredictionsTableProps) => {
  return (
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
  );
};
