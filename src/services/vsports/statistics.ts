
import { HistoricalMatch, CurrentMatch, TeamStats, HeadToHead, PatternFrequency } from './types';

// Csapat statisztikák kiszámítása
export const calculateTeamStats = (historicalData: HistoricalMatch[]): TeamStats[] => {
  const teams = new Map<string, TeamStats>();

  // Minden csapat inicializálása
  historicalData.forEach((match) => {
    if (!teams.has(match.home_team)) {
      teams.set(match.home_team, {
        team: match.home_team,
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        winPercentage: 0,
      });
    }

    if (!teams.has(match.away_team)) {
      teams.set(match.away_team, {
        team: match.away_team,
        matches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        winPercentage: 0,
      });
    }
  });

  // Statisztikák kiszámítása
  historicalData.forEach((match) => {
    const homeTeam = teams.get(match.home_team);
    const awayTeam = teams.get(match.away_team);

    if (homeTeam && awayTeam) {
      // Hazai csapat statisztikák
      homeTeam.matches++;
      homeTeam.goalsFor += match.home_score;
      homeTeam.goalsAgainst += match.away_score;

      if (match.home_score > match.away_score) {
        homeTeam.wins++;
      } else if (match.home_score === match.away_score) {
        homeTeam.draws++;
      } else {
        homeTeam.losses++;
      }

      // Vendég csapat statisztikák
      awayTeam.matches++;
      awayTeam.goalsFor += match.away_score;
      awayTeam.goalsAgainst += match.home_score;

      if (match.away_score > match.home_score) {
        awayTeam.wins++;
      } else if (match.away_score === match.home_score) {
        awayTeam.draws++;
      } else {
        awayTeam.losses++;
      }
    }
  });

  // Győzelmi százalék kiszámítása
  teams.forEach((team) => {
    team.winPercentage = team.matches > 0 ? (team.wins / team.matches) * 100 : 0;
  });

  // Rendezés győzelmi százalék szerint
  return Array.from(teams.values()).sort((a, b) => b.winPercentage - a.winPercentage);
};

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

// Mintázat gyakoriságok kiszámítása
export const calculatePatternFrequencies = (historicalData: HistoricalMatch[]): PatternFrequency[] => {
  const patternCounts = new Map<string, number>();
  patternCounts.set("Hazai győzelem", 0);
  patternCounts.set("Döntetlen", 0);
  patternCounts.set("Vendég győzelem", 0);
  patternCounts.set("Mindkét csapat betalál", 0);
  patternCounts.set("Nem talál be mindkét csapat", 0);
  patternCounts.set("Több mint 2.5 gól", 0);
  patternCounts.set("Kevesebb mint 2.5 gól", 0);

  historicalData.forEach((match) => {
    // Győztes
    if (match.home_score > match.away_score) {
      patternCounts.set("Hazai győzelem", (patternCounts.get("Hazai győzelem") || 0) + 1);
    } else if (match.home_score === match.away_score) {
      patternCounts.set("Döntetlen", (patternCounts.get("Döntetlen") || 0) + 1);
    } else {
      patternCounts.set("Vendég győzelem", (patternCounts.get("Vendég győzelem") || 0) + 1);
    }

    // Gólok
    if (match.home_score > 0 && match.away_score > 0) {
      patternCounts.set("Mindkét csapat betalál", (patternCounts.get("Mindkét csapat betalál") || 0) + 1);
    } else {
      patternCounts.set("Nem talál be mindkét csapat", (patternCounts.get("Nem talál be mindkét csapat") || 0) + 1);
    }

    if (match.home_score + match.away_score > 2.5) {
      patternCounts.set("Több mint 2.5 gól", (patternCounts.get("Több mint 2.5 gól") || 0) + 1);
    } else {
      patternCounts.set("Kevesebb mint 2.5 gól", (patternCounts.get("Kevesebb mint 2.5 gól") || 0) + 1);
    }
  });

  // Százalékok kiszámítása
  const totalMatches = historicalData.length;
  const frequencies: PatternFrequency[] = [];

  patternCounts.forEach((count, pattern) => {
    frequencies.push({
      pattern,
      count,
      percentage: (count / totalMatches) * 100,
    });
  });

  // Rendezés gyakoriság szerint
  return frequencies.sort((a, b) => b.percentage - a.percentage);
};

// Mindkét csapat betalál valószínűség kiszámítása
export const calculateBothTeamsToScoreProb = (matches: HistoricalMatch[]): number => {
  if (matches.length === 0) {
    return 0.0;
  }
  
  const bothScoredCount = matches.filter(match => 
    match.home_score > 0 && match.away_score > 0
  ).length;
  
  return (bothScoredCount / matches.length) * 100;
};
