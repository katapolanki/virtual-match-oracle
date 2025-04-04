
import { HistoricalMatch, CurrentMatch } from './types';

// CSV fájl feldolgozása
export const parseCSV = (csvText: string): HistoricalMatch[] => {
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
export const parseCurrentRoundCSV = (csvText: string): CurrentMatch[] => {
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
