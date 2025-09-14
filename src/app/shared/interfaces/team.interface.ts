export interface Team {
  id: string;
  name: string;
  logo?: string;
  foundedYear: number;
  stadium: string;
  city: string;
  players: Player[];
  statistics: TeamStatistics;
  createdAt: Date;
  updatedAt: Date;
}

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  number: number;
  age: number;
  teamId: string;
  statistics: PlayerStatistics;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PlayerPosition {
  GOALKEEPER = 'Goleiro',
  DEFENDER = 'Zagueiro',
  MIDFIELDER = 'Meio-campista',
  FORWARD = 'Atacante'
}

export interface TeamStatistics {
  matches: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
  goalDifference: number;
}

export interface PlayerStatistics {
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  minutesPlayed: number;
}
