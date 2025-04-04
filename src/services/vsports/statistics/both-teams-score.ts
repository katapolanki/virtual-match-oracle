
import { HistoricalMatch } from '../types';

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
