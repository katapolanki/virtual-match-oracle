
import { VirtualMatch, MatchPrediction, TeamStats, headToHeadBTTSPercentage, teamStatsData } from "../data/virtualMatchesData";

// Predikciók kiszámítása
export const calculatePredictions = (matches: VirtualMatch[]): MatchPrediction[] => {
  const predictions: MatchPrediction[] = [];

  matches.forEach((match) => {
    const homeTeamStats = teamStatsData.find((t) => t.team === match.homeTeam);
    const awayTeamStats = teamStatsData.find((t) => t.team === match.awayTeam);

    if (!homeTeamStats || !awayTeamStats) return;

    // Mindkét csapat betalál valószínűség kiszámítása
    let bothTeamsScoredProb = 0;
    let explanation = "";

    // 1. Egymás elleni mérkőzések alapján
    const h2hKey = `${match.homeTeam}-${match.awayTeam}`;
    const h2hBTTSPercentage = headToHeadBTTSPercentage[h2hKey] || 50;

    bothTeamsScoredProb += h2hBTTSPercentage * 0.6; // 60% súly az egymás elleni mérkőzéseknek
    explanation = `A ${match.homeTeam} és a ${match.awayTeam} közötti mérkőzések ${h2hBTTSPercentage}%-ában mindkét csapat betalált.`;

    // 2. Csapatok gólszerzési képessége alapján
    if (homeTeamStats.scoringRate >= 1.0 && awayTeamStats.scoringRate >= 0.8) {
      bothTeamsScoredProb += 20; // Növeljük a valószínűséget
      explanation += ` A ${match.homeTeam} átlagosan ${homeTeamStats.scoringRate.toFixed(1)} gólt szerez, a ${match.awayTeam} pedig ${awayTeamStats.scoringRate.toFixed(1)} gólt meccsenként.`;
    }

    // 3. Csapatok védekezési képessége alapján
    if (homeTeamStats.concedingRate >= 0.8 && awayTeamStats.concedingRate >= 1.0) {
      bothTeamsScoredProb += 20; // Növeljük a valószínűséget
      explanation += ` A ${match.homeTeam} átlagosan ${homeTeamStats.concedingRate.toFixed(1)} gólt kap, a ${match.awayTeam} pedig ${awayTeamStats.concedingRate.toFixed(1)} gólt meccsenként.`;
    }

    // Normalizáljuk a valószínűséget 0-100 közé
    bothTeamsScoredProb = Math.min(Math.max(bothTeamsScoredProb, 0), 100);

    // Odds kiszámítása a valószínűség alapján (inverz kapcsolat)
    let odds = 0;
    if (bothTeamsScoredProb > 0) {
      odds = 100 / bothTeamsScoredProb;
      odds = Math.max(Math.min(odds, 5), 1.3); // Korlátozzuk 1.3 és 5 közé
    } else {
      odds = 3.0; // Alapértelmezett odds, ha nincs elég adat
    }

    predictions.push({
      id: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      prediction: "Mindkét csapat betalál",
      odds: Number.parseFloat(odds.toFixed(2)),
      confidence: Number.parseFloat(bothTeamsScoredProb.toFixed(0)),
      explanation,
    });
  });

  // Rendezés megbízhatóság szerint
  return predictions.sort((a, b) => b.confidence - a.confidence);
};
