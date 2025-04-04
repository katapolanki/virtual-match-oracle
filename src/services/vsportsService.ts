
import {
  HistoricalMatch,
  CurrentMatch,
  TeamStats,
  HeadToHead,
  PatternFrequency,
  MatchPrediction,
  HISTORICAL_DATA_URL,
  CURRENT_ROUND_URL
} from './vsports/types';
import { parseCSV, parseCurrentRoundCSV } from './vsports/parsers';
import { calculateTeamStats, calculateHeadToHeadStats, calculatePatternFrequencies } from './vsports/statistics';
import { generatePredictions } from './vsports/predictions';

export {
  HistoricalMatch,
  CurrentMatch,
  TeamStats,
  HeadToHead,
  PatternFrequency,
  MatchPrediction
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
  const historicalResponse = await fetch(HISTORICAL_DATA_URL);
  const historicalText = await historicalResponse.text();
  const historicalData = parseCSV(historicalText);

  // Aktuális forduló adatainak letöltése
  const currentResponse = await fetch(CURRENT_ROUND_URL);
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
