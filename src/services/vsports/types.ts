
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

// CSV fájlok URL-jei
export const HISTORICAL_DATA_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cleaned_matches_supabase_data-dglwJkgzIfbtkMAXo8WoEQMo8Rf7D4.csv";
export const CURRENT_ROUND_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/aktualis_fordulu-x8pY4Tlp42Vq6yYfP2DNTuPgNnHpd9.csv";
