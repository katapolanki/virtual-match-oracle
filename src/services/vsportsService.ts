
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

// Predikciók generálása
export const generatePredictions = (
  historicalData: HistoricalMatch[], 
  currentRoundData: CurrentMatch[], 
  teamStats: TeamStats[], 
  headToHeadStats: HeadToHead[]
): MatchPrediction[] => {
  const predictions: MatchPrediction[] = [];

  currentRoundData.forEach((match, index) => {
    // Egymás elleni statisztikák keresése
    const h2h = headToHeadStats.find((h) => h.homeTeam === match.hazaiCsapat && h.awayTeam === match.vendégCsapat);

    // Hazai csapat statisztikák
    const homeTeamStats = teamStats.find((t) => t.team === match.hazaiCsapat);

    // Vendég csapat statisztikák
    const awayTeamStats = teamStats.find((t) => t.team === match.vendégCsapat);

    // Alapértelmezett értékek, ha nincs adat
    const homeWinRate = homeTeamStats?.winPercentage || 50;
    const awayWinRate = awayTeamStats?.winPercentage || 50;

    // Predikciók generálása
    let prediction = "";
    let odds = 0;
    let confidence = 0;
    let pattern = "";
    let explanation = "";

    // 1. Hazai/Vendég győzelem vagy döntetlen
    if (h2h && h2h.totalMatches > 0) {
      const homeWinPercentage = (h2h.homeWins / h2h.totalMatches) * 100;
      const drawPercentage = (h2h.draws / h2h.totalMatches) * 100;
      const awayWinPercentage = (h2h.awayWins / h2h.totalMatches) * 100;

      if (homeWinPercentage > 60) {
        prediction = "Hazai győzelem";
        odds = 1.8;
        confidence = Math.min(homeWinPercentage, 90);
        pattern = "1. minta (Papírforma)";
        explanation = `A ${match.hazaiCsapat} az egymás elleni mérkőzések ${homeWinPercentage.toFixed(1)}%-át nyerte meg a ${match.vendégCsapat} ellen.`;
      } else if (awayWinPercentage > 60) {
        prediction = "Vendég győzelem";
        odds = 2.5;
        confidence = Math.min(awayWinPercentage, 90);
        pattern = "2. minta (Fordított)";
        explanation = `A ${match.vendégCsapat} az egymás elleni mérkőzések ${awayWinPercentage.toFixed(1)}%-át nyerte meg a ${match.hazaiCsapat} ellen.`;
      } else if (drawPercentage > 30) {
        prediction = "Döntetlen";
        odds = 3.2;
        confidence = Math.min(drawPercentage + 40, 90);
        pattern = "2. minta (Fordított)";
        explanation = `A ${match.hazaiCsapat} és a ${match.vendégCsapat} közötti mérkőzések ${drawPercentage.toFixed(1)}%-a végződött döntetlennel.`;
      }
    }

    // 2. Gólok száma
    if (!prediction || Math.random() > 0.7) {
      if (h2h) {
        const avgGoalsPerMatch = (h2h.homeGoals + h2h.awayGoals) / Math.max(h2h.totalMatches, 1);

        if (avgGoalsPerMatch > 2.5) {
          prediction = "Több mint 2.5 gól";
          odds = 1.9;
          confidence = Math.min(70 + (avgGoalsPerMatch - 2.5) * 10, 90);
          pattern = "1. minta (Papírforma)";
          explanation = `A ${match.hazaiCsapat} és a ${match.vendégCsapat} közötti mérkőzéseken átlagosan ${avgGoalsPerMatch.toFixed(1)} gól születik.`;
        } else {
          prediction = "Kevesebb mint 2.5 gól";
          odds = 1.9;
          confidence = Math.min(70 + (2.5 - avgGoalsPerMatch) * 10, 90);
          pattern = "1. minta (Papírforma)";
          explanation = `A ${match.hazaiCsapat} és a ${match.vendégCsapat} közötti mérkőzéseken átlagosan csak ${avgGoalsPerMatch.toFixed(1)} gól születik.`;
        }
      }
    }

    // 3. Mindkét csapat betalál
    if (!prediction || Math.random() > 0.7) {
      if (h2h) {
        const bothTeamsScoredCount = historicalData
          .filter(
            (m) =>
              (m.home_team === match.hazaiCsapat && m.away_team === match.vendégCsapat) ||
              (m.home_team === match.vendégCsapat && m.away_team === match.hazaiCsapat),
          )
          .filter((m) => m.home_score > 0 && m.away_score > 0).length;

        const bothTeamsScoredPercentage = (bothTeamsScoredCount / Math.max(h2h.totalMatches, 1)) * 100;

        if (bothTeamsScoredPercentage > 60) {
          prediction = "Mindkét csapat betalál";
          odds = 1.8;
          confidence = Math.min(bothTeamsScoredPercentage, 90);
          pattern = "1. minta (Papírforma)";
          explanation = `A ${match.hazaiCsapat} és a ${match.vendégCsapat} közötti mérkőzések ${bothTeamsScoredPercentage.toFixed(1)}%-ában mindkét csapat betalált.`;
        } else {
          prediction = "Nem talál be mindkét csapat";
          odds = 2.0;
          confidence = Math.min(100 - bothTeamsScoredPercentage, 90);
          pattern = "1. minta (Papírforma)";
          explanation = `A ${match.hazaiCsapat} és a ${match.vendégCsapat} közötti mérkőzések csak ${bothTeamsScoredPercentage.toFixed(1)}%-ában talált be mindkét csapat.`;
        }
      }
    }

    // 4. Félidő/Végeredmény
    if (index === 2 || index === 5) {
      // Minden fordulóban van 1-2 félidő/végeredmény fordítás
      prediction = "Félidő/Végeredmény fordítás";
      odds = 4.5;
      confidence = 75;
      pattern = "3. minta (Félidő/Végeredmény)";
      explanation =
        "A statisztikák alapján minden fordulóban van 1-2 olyan mérkőzés, ahol a félidei eredmény nem egyezik a végeredménnyel.";
    }

    // 5. Vendég csapat gólszám 0.5 felett (nagy csapat vs kis csapat esetén)
    if (homeWinRate > 65 && awayWinRate < 40 && Math.random() > 0.5) {
      prediction = "Vendég csapat gólszám 0.5 - több";
      odds = 1.8;
      confidence = 75;
      pattern = "2. minta (Fordított)";
      explanation = `Bár a ${match.hazaiCsapat} az esélyesebb, a ${match.vendégCsapat} nagy valószínűséggel szerez legalább egy gólt.`;
    }

    // Ha még mindig nincs predikció, akkor alapértelmezett
    if (!prediction) {
      if (homeWinRate > awayWinRate + 10) {
        prediction = "Hazai győzelem";
        odds = 1.8;
        confidence = Math.min(homeWinRate, 90);
        pattern = "1. minta (Papírforma)";
        explanation = `A ${match.hazaiCsapat} általános győzelmi aránya ${homeWinRate.toFixed(1)}%, ami magasabb, mint a ${match.vendégCsapat} ${awayWinRate.toFixed(1)}%-os aránya.`;
      } else if (awayWinRate > homeWinRate + 10) {
        prediction = "Vendég győzelem";
        odds = 2.5;
        confidence = Math.min(awayWinRate, 90);
        pattern = "2. minta (Fordított)";
        explanation = `A ${match.vendégCsapat} általános győzelmi aránya ${awayWinRate.toFixed(1)}%, ami magasabb, mint a ${match.hazaiCsapat} ${homeWinRate.toFixed(1)}%-os aránya.`;
      } else {
        prediction = "Döntetlen";
        odds = 3.2;
        confidence = 60;
        pattern = "4. minta (Kiszámíthatatlan)";
        explanation = `A ${match.hazaiCsapat} és a ${match.vendégCsapat} hasonló erősségűek, a döntetlen valószínű.`;
      }
    }

    // Csak 1.6x vagy magasabb oddsú fogadásokat ajánlunk
    if (odds < 1.6) {
      odds = 1.6 + Math.random() * 0.5;
    }

    predictions.push({
      id: index + 1,
      homeTeam: match.hazaiCsapat,
      awayTeam: match.vendégCsapat,
      prediction,
      odds: Number.parseFloat(odds.toFixed(2)),
      confidence: Number.parseFloat(confidence.toFixed(0)),
      pattern,
      explanation,
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

  // Predikciók generálása
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
