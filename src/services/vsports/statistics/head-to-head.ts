
import { HistoricalMatch, CurrentMatch, HeadToHead } from '../types';

// Egymás elleni statisztikák kiszámítása
export const calculateHeadToHeadStats = (
  historicalData: HistoricalMatch[], 
  currentRoundData: CurrentMatch[]
): HeadToHead[] => {
  const h2hMap = new Map<string, HeadToHead>();

  // Aktuális forduló mérkőzéseinek egymás elleni statisztikái
  currentRoundData.forEach((match) => {
    const key = `${match.hazaiCsapat}-${match.vendégCsapat}`;

    if (!h2hMap.has(key)) {
      h2hMap.set(key, {
        homeTeam: match.hazaiCsapat,
        awayTeam: match.vendégCsapat,
        totalMatches: 0,
        homeWins: 0,
        draws: 0,
        awayWins: 0,
        homeGoals: 0,
        awayGoals: 0,
      });
    }
  });

  // Statisztikák kiszámítása a történelmi adatokból
  historicalData.forEach((match) => {
    // Csak az aktuális forduló mérkőzéseinek egymás elleni statisztikáit számoljuk
    const key = `${match.home_team}-${match.away_team}`;
    const reverseKey = `${match.away_team}-${match.home_team}`;

    if (h2hMap.has(key)) {
      const stats = h2hMap.get(key);
      if (stats) {
        stats.totalMatches++;
        stats.homeGoals += match.home_score;
        stats.awayGoals += match.away_score;

        if (match.home_score > match.away_score) {
          stats.homeWins++;
        } else if (match.home_score === match.away_score) {
          stats.draws++;
        } else {
          stats.awayWins++;
        }
      }
    } else if (h2hMap.has(reverseKey)) {
      // Ha a fordított párosítás szerepel az aktuális fordulóban
      const stats = h2hMap.get(reverseKey);
      if (stats) {
        stats.totalMatches++;
        // Fordított szerepek
        stats.awayGoals += match.home_score;
        stats.homeGoals += match.away_score;

        if (match.home_score > match.away_score) {
          stats.awayWins++; // Fordított szerepek
        } else if (match.home_score === match.away_score) {
          stats.draws++;
        } else {
          stats.homeWins++; // Fordított szerepek
        }
      }
    }
  });

  return Array.from(h2hMap.values());
};
