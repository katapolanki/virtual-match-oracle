
// Típusok definiálása
export type VirtualMatch = {
  id: number
  date: string
  homeTeam: string
  awayTeam: string
  homeGoals?: number
  awayGoals?: number
}

export type MatchPrediction = {
  id: number
  homeTeam: string
  awayTeam: string
  prediction: string
  odds: number
  confidence: number
  explanation: string
}

export type TeamStats = {
  team: string
  matches: number
  goalsScored: number
  goalsConceded: number
  scoringRate: number
  concedingRate: number
}

// Virtuális mérkőzések adatai
export const virtualMatches15: VirtualMatch[] = [
  { id: 1, date: "05:59", homeTeam: "Brighton", awayTeam: "Brentford" },
  { id: 2, date: "05:59", homeTeam: "Wolverhampton", awayTeam: "Chelsea" },
  { id: 3, date: "05:59", homeTeam: "Newcastle", awayTeam: "Aston Oroszlán" },
  { id: 4, date: "05:59", homeTeam: "Fulham", awayTeam: "London Ágyúk" },
  { id: 5, date: "05:59", homeTeam: "Tottenham", awayTeam: "Crystal Palace" },
  { id: 6, date: "05:59", homeTeam: "Liverpool", awayTeam: "Nottingham" },
  { id: 7, date: "05:59", homeTeam: "Everton", awayTeam: "West Ham" },
  { id: 8, date: "05:59", homeTeam: "Manchester Kék", awayTeam: "Vidéki Oroszlánok" },
]

export const virtualMatches16: VirtualMatch[] = [
  { id: 9, date: "06:06", homeTeam: "Brighton", awayTeam: "Aston Oroszlán" },
  { id: 10, date: "06:06", homeTeam: "Fulham", awayTeam: "Crystal Palace" },
  { id: 11, date: "06:06", homeTeam: "Manchester Kék", awayTeam: "London Ágyúk" },
  { id: 12, date: "06:06", homeTeam: "Tottenham", awayTeam: "Chelsea" },
  { id: 13, date: "06:06", homeTeam: "Everton", awayTeam: "Brentford" },
  { id: 14, date: "06:06", homeTeam: "West Ham", awayTeam: "Liverpool" },
  { id: 15, date: "06:06", homeTeam: "Wolverhampton", awayTeam: "Nottingham" },
  { id: 16, date: "06:06", homeTeam: "Newcastle", awayTeam: "Vidéki Oroszlánok" },
]

// Szimulált történelmi adatok a csapatokról
export const teamStatsData: TeamStats[] = [
  { team: "Liverpool", matches: 100, goalsScored: 180, goalsConceded: 70, scoringRate: 1.8, concedingRate: 0.7 },
  { team: "Manchester Kék", matches: 100, goalsScored: 175, goalsConceded: 75, scoringRate: 1.75, concedingRate: 0.75 },
  { team: "Chelsea", matches: 100, goalsScored: 160, goalsConceded: 80, scoringRate: 1.6, concedingRate: 0.8 },
  { team: "Tottenham", matches: 100, goalsScored: 155, goalsConceded: 90, scoringRate: 1.55, concedingRate: 0.9 },
  { team: "London Ágyúk", matches: 100, goalsScored: 150, goalsConceded: 95, scoringRate: 1.5, concedingRate: 0.95 },
  { team: "West Ham", matches: 100, goalsScored: 130, goalsConceded: 110, scoringRate: 1.3, concedingRate: 1.1 },
  { team: "Brighton", matches: 100, goalsScored: 125, goalsConceded: 115, scoringRate: 1.25, concedingRate: 1.15 },
  { team: "Newcastle", matches: 100, goalsScored: 120, goalsConceded: 120, scoringRate: 1.2, concedingRate: 1.2 },
  { team: "Aston Oroszlán", matches: 100, goalsScored: 115, goalsConceded: 125, scoringRate: 1.15, concedingRate: 1.25 },
  { team: "Brentford", matches: 100, goalsScored: 110, goalsConceded: 130, scoringRate: 1.1, concedingRate: 1.3 },
  { team: "Crystal Palace", matches: 100, goalsScored: 105, goalsConceded: 135, scoringRate: 1.05, concedingRate: 1.35 },
  { team: "Wolverhampton", matches: 100, goalsScored: 100, goalsConceded: 140, scoringRate: 1.0, concedingRate: 1.4 },
  { team: "Everton", matches: 100, goalsScored: 95, goalsConceded: 145, scoringRate: 0.95, concedingRate: 1.45 },
  { team: "Fulham", matches: 100, goalsScored: 90, goalsConceded: 150, scoringRate: 0.9, concedingRate: 1.5 },
  { team: "Vidéki Oroszlánok", matches: 100, goalsScored: 85, goalsConceded: 155, scoringRate: 0.85, concedingRate: 1.55 },
  { team: "Nottingham", matches: 100, goalsScored: 80, goalsConceded: 160, scoringRate: 0.8, concedingRate: 1.6 },
]

// Szimulált egymás elleni statisztikák - mindkét csapat gólt szerzett százalékban
export const headToHeadBTTSPercentage: Record<string, number> = {
  "Brighton-Brentford": 65,
  "Wolverhampton-Chelsea": 55,
  "Newcastle-Aston Oroszlán": 70,
  "Fulham-London Ágyúk": 60,
  "Tottenham-Crystal Palace": 75,
  "Liverpool-Nottingham": 50,
  "Everton-West Ham": 80,
  "Manchester Kék-Vidéki Oroszlánok": 60,
  "Brighton-Aston Oroszlán": 75,
  "Fulham-Crystal Palace": 65,
  "Manchester Kék-London Ágyúk": 85,
  "Tottenham-Chelsea": 80,
  "Everton-Brentford": 70,
  "West Ham-Liverpool": 75,
  "Wolverhampton-Nottingham": 55,
  "Newcastle-Vidéki Oroszlánok": 60,
}
