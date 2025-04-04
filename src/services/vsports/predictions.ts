
import { HistoricalMatch, CurrentMatch, TeamStats, HeadToHead, MatchPrediction } from './types';
import { calculateBothTeamsToScoreProb } from './statistics';

// Predikciók generálása - mostantól csak a "mindkét csapat betalál" predikciókra fókuszálva
export const generatePredictions = (
  historicalData: HistoricalMatch[], 
  currentRoundData: CurrentMatch[], 
  teamStats: TeamStats[], 
  headToHeadStats: HeadToHead[]
): MatchPrediction[] => {
  const predictions: MatchPrediction[] = [];

  currentRoundData.forEach((match, index) => {
    // Egymás elleni statisztikák keresése
    const h2h = headToHeadStats.find(
      h => h.homeTeam === match.hazaiCsapat && h.awayTeam === match.vendégCsapat
    );
    
    // Hazai csapat statisztikák
    const homeTeamStats = teamStats.find(t => t.team === match.hazaiCsapat);
    
    // Vendég csapat statisztikák
    const awayTeamStats = teamStats.find(t => t.team === match.vendégCsapat);
    
    // Mindkét csapat betalál valószínűség kiszámítása
    let bothTeamsScoredProb = 0;
    let explanation = "";
    
    // 1. Egymás elleni mérkőzések alapján
    if (h2h && h2h.totalMatches > 0) {
      const bothTeamsScoredCount = historicalData.filter(
        m => (m.home_team === match.hazaiCsapat && m.away_team === match.vendégCsapat) || 
             (m.home_team === match.vendégCsapat && m.away_team === match.hazaiCsapat)
      ).filter(m => m.home_score > 0 && m.away_score > 0).length;
      
      const h2hBothTeamsScoredPercentage = (bothTeamsScoredCount / Math.max(h2h.totalMatches, 1)) * 100;
      bothTeamsScoredProb += h2hBothTeamsScoredPercentage * 0.6; // 60% súly az egymás elleni mérkőzéseknek
      
      explanation = `A ${match.hazaiCsapat} és a ${match.vendégCsapat} közötti mérkőzések ${h2hBothTeamsScoredPercentage.toFixed(1)}%-ában mindkét csapat betalált.`;
    }
    
    // 2. Csapatok általános gólszerzési képessége alapján
    const homeTeamScoringRate = homeTeamStats ? 
      homeTeamStats.goalsFor / Math.max(homeTeamStats.matches, 1) : 1.5;
    const awayTeamScoringRate = awayTeamStats ? 
      awayTeamStats.goalsFor / Math.max(awayTeamStats.matches, 1) : 1.0;
    
    // Ha mindkét csapat átlagosan legalább 1 gólt szerez meccsenként, az növeli a valószínűséget
    if (homeTeamScoringRate >= 1.0 && awayTeamScoringRate >= 0.8) {
      bothTeamsScoredProb += 20; // Növeljük a valószínűséget
      explanation += ` A ${match.hazaiCsapat} átlagosan ${homeTeamScoringRate.toFixed(1)} gólt szerez, a ${match.vendégCsapat} pedig ${awayTeamScoringRate.toFixed(1)} gólt meccsenként.`;
    }
    
    // 3. Csapatok védekezési képessége alapján
    const homeTeamConcedingRate = homeTeamStats ? 
      homeTeamStats.goalsAgainst / Math.max(homeTeamStats.matches, 1) : 1.0;
    const awayTeamConcedingRate = awayTeamStats ? 
      awayTeamStats.goalsAgainst / Math.max(awayTeamStats.matches, 1) : 1.5;
    
    // Ha mindkét csapat átlagosan legalább 1 gólt kap meccsenként, az növeli a valószínűséget
    if (homeTeamConcedingRate >= 0.8 && awayTeamConcedingRate >= 1.0) {
      bothTeamsScoredProb += 20; // Növeljük a valószínűséget
      explanation += ` A ${match.hazaiCsapat} átlagosan ${homeTeamConcedingRate.toFixed(1)} gólt kap, a ${match.vendégCsapat} pedig ${awayTeamConcedingRate.toFixed(1)} gólt meccsenként.`;
    }
    
    // Normalizáljuk a valószínűséget 0-100 közé
    bothTeamsScoredProb = Math.min(Math.max(bothTeamsScoredProb, 0), 100);
    
    // Finomítsuk a valószínűséget
    const relevantMatches = historicalData.filter(m => 
      m.home_team === match.hazaiCsapat || m.away_team === match.hazaiCsapat ||
      m.home_team === match.vendégCsapat || m.away_team === match.vendégCsapat
    );
    
    const bttsProb = calculateBothTeamsToScoreProb(relevantMatches);
    bothTeamsScoredProb = (bothTeamsScoredProb * 0.7) + (bttsProb * 0.3); // Súlyozott átlag
    
    // Odds kiszámítása a valószínűség alapján (inverz kapcsolat)
    // Minél nagyobb a valószínűség, annál kisebb az odds
    let odds = 0;
    if (bothTeamsScoredProb > 0) {
      odds = 100 / bothTeamsScoredProb;
      odds = Math.max(Math.min(odds, 5), 1.3); // Korlátozzuk 1.3 és 5 közé
    } else {
      odds = 3.0; // Alapértelmezett odds, ha nincs elég adat
    }
    
    predictions.push({
      id: index + 1,
      homeTeam: match.hazaiCsapat,
      awayTeam: match.vendégCsapat,
      prediction: "Mindkét csapat betalál",
      odds: Number.parseFloat(odds.toFixed(2)),
      confidence: Number.parseFloat(bothTeamsScoredProb.toFixed(0)),
      pattern: "3. minta (Mindkét csapat betalál)",
      explanation
    });
  });
  
  // Rendezés megbízhatóság szerint
  return predictions.sort((a, b) => b.confidence - a.confidence);
};
