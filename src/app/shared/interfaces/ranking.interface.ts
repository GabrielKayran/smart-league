export interface RankingEntry {
  position: number;
  teamId: string;
  teamName: string;
  teamLogo?: string;
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: MatchResult[];
}

export interface MatchResult {
  result: 'W' | 'D' | 'L';
  opponent: string;
  score: string;
}

export interface LeagueStandings {
  season: string;
  lastUpdated: Date;
  entries: RankingEntry[];
}

export interface TopScorer {
  playerId: string;
  playerName: string;
  teamName: string;
  goals: number;
  matches: number;
  photo?: string;
}

export interface TopAssists {
  playerId: string;
  playerName: string;
  teamName: string;
  assists: number;
  matches: number;
  photo?: string;
}
