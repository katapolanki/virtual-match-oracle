
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { TeamStats, CurrentMatch } from "@/services/vsports/types";

interface StatisticsTabProps {
  isLoading: boolean;
  hasLoaded: boolean;
  teamStats: TeamStats[];
  currentMatches: CurrentMatch[];
}

export const StatisticsTab = ({ isLoading, hasLoaded, teamStats, currentMatches }: StatisticsTabProps) => {
  return (
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
  );
};
