
import { HistoricalMatch, PatternFrequency } from '../types';

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
