
import { HistoricalMatch, TeamStats } from '../types';

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
