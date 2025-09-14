export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: Date;
  stadium: string;
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export enum MatchStatus {
  SCHEDULED = 'Agendada',
  LIVE = 'Ao Vivo',
  FINISHED = 'Finalizada',
  POSTPONED = 'Adiada',
  CANCELLED = 'Cancelada'
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: EventType;
  playerId: string;
  playerName: string;
  teamId: string;
  minute: number;
  description: string;
  createdAt: Date;
}

export enum EventType {
  GOAL = 'Gol',
  YELLOW_CARD = 'Cartão Amarelo',
  RED_CARD = 'Cartão Vermelho',
  SUBSTITUTION = 'Substituição',
  OWN_GOAL = 'Gol Contra'
}

export interface MatchResult {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  date: Date;
  winner?: string;
}
