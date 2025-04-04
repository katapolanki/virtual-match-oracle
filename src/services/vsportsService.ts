// CSV fájlok URL-jei
const historicalDataUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cleaned_matches_supabase_data-dglwJkgzIfbtkMAXo8WoEQMo8Rf7D4.csv"
const currentRoundUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aktualis_fordulu-x8pY4Tlp42Vq6yYfP2DNTuPgNnHpd9.csv"

// Típusok
export interface HistoricalMatch {
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
}

export interface CurrentMatch {
  időpont: string;
  hazaiCsapat: string;
  vendégCsapat: string;
  félidőHazaiGól: string;
  félidőVendégGól: string;
  végeredményHazaiGól: string;
  végeredményVendégGól: string;
}

export interface TeamStats {
  team: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  winPercentage: number;
}

export interface HeadToHead {
  homeTeam: string;
  awayTeam: string;
  totalMatches: number;
  homeWins: number;
  draws: number;
  awayWins: number;
  homeGoals: number;
  awayGoals: number;
}

export interface MatchPrediction {
  id: number;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
  confidence: number;
  pattern: string;
  explanation: string;
}

export interface PatternFrequency {
  pattern: string;
  count: number;
  percentage: number;
}

// CSV fájl feldolgozása
const parseCSV = (csvText: string): HistoricalMatch[] => {
  const lines = csvText.split("\n");
  
  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",");
      return {
        home_team: values[0]?.trim() || "",
        away_team: values[1]?.trim() || "",
        home_score: Number.parseInt(values[2], 10) || 0,
        away_score: Number.parseInt(values[3], 10) || 0,
      };
    });
};

// Aktuális forduló CSV fájl feldolgozása
const parseCurrentRoundCSV = (csvText: string): CurrentMatch[] => {
  const lines = csvText.split("\n");
  
  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",");
      return {
        időpont: values[0]?.trim() || "",
        hazaiCsapat: values[1]?.trim() || "",
        vendégCsapat: values[2]?.trim() || "",
        félidőHazaiGól: values[3]?.trim() || "",
        félidőVendégGól: values[4]?.trim() || "",
        végeredményHazaiGól: values[5]?.trim() || "",
        végeredményVendégGól: values[6]?.trim() || "",
      };
    });
};

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

// Mindkét csapat betalál valószínűség kiszámítása
const calculateBothTeamsToScoreProb = (matches: HistoricalMatch[]): number => {
  if (matches.length === 0) {
    return 0.0;
  }
  
  const bothScoredCount = matches.filter(match => 
    match.home_score > 0 && match.away_score > 0
  ).length;
  
  return (bothScoredCount / matches.length) * 100;
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

// Adatok letöltése
export const fetchData = async (): Promise<{
  historicalData: HistoricalMatch[];
  currentRoundData: CurrentMatch[];
  teamStats: TeamStats[];
  headToHeadStats: HeadToHead[];
  patternFrequencies: PatternFrequency[];
  predictions: MatchPrediction[];
}> => {
  // Történelmi adatok letöltése
  const historicalResponse = await fetch(historicalDataUrl);
  const historicalText = await historicalResponse.text();
  const historicalData = parseCSV(historicalText);

  // Aktuális forduló adatainak letöltése
  const currentResponse = await fetch(currentRoundUrl);
  const currentText = await currentResponse.text();
  const currentRoundData = parseCurrentRoundCSV(currentText);

  // Csapat statisztikák kiszámítása
  const teamStats = calculateTeamStats(historicalData);

  // Egymás elleni statisztikák kiszámítása
  const headToHeadStats = calculateHeadToHeadStats(historicalData, currentRoundData);

  // Mintázat gyakoriságok kiszámítása
  const patternFrequencies = calculatePatternFrequencies(historicalData);

  // Predikciók generálása - csak a "mindkét csapat betalál" predikciók
  const predictions = generatePredictions(historicalData, currentRoundData, teamStats, headToHeadStats);

  return {
    historicalData,
    currentRoundData,
    teamStats,
    headToHeadStats,
    patternFrequencies,
    predictions,
  };
};
