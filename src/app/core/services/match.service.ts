import { Injectable, signal, computed } from '@angular/core';
import { Match, MatchEvent, MatchStatus, EventType, MatchResult } from '@shared/interfaces/match.interface';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private matchesSignal = signal<Match[]>([]);
  private eventsSignal = signal<MatchEvent[]>([]);

  matches = this.matchesSignal.asReadonly();
  events = this.eventsSignal.asReadonly();

  liveMatches = computed(() => 
    this.matchesSignal().filter(match => match.status === MatchStatus.LIVE)
  );

  upcomingMatches = computed(() => 
    this.matchesSignal().filter(match => match.status === MatchStatus.SCHEDULED)
  );

  finishedMatches = computed(() => 
    this.matchesSignal().filter(match => match.status === MatchStatus.FINISHED)
  );

  constructor() {
    this.loadMockData();
  }

  createMatch(matchData: Omit<Match, 'id' | 'homeScore' | 'awayScore' | 'events' | 'createdAt' | 'updatedAt'>): string {
    const newMatch: Match = {
      ...matchData,
      id: this.generateId(),
      homeScore: 0,
      awayScore: 0,
      events: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.matchesSignal.update(matches => [...matches, newMatch]);
    return newMatch.id;
  }

  updateMatchStatus(matchId: string, status: MatchStatus): boolean {
    const matchExists = this.matchesSignal().some(match => match.id === matchId);
    if (!matchExists) return false;

    this.matchesSignal.update(matches =>
      matches.map(match =>
        match.id === matchId
          ? { ...match, status, updatedAt: new Date() }
          : match
      )
    );
    return true;
  }

  registerEvent(matchId: string, eventData: Omit<MatchEvent, 'id' | 'matchId' | 'createdAt'>): string {
    const match = this.getMatchById(matchId);
    if (!match) throw new Error('Partida não encontrada');

    const newEvent: MatchEvent = {
      ...eventData,
      id: this.generateId(),
      matchId,
      createdAt: new Date()
    };

    this.eventsSignal.update(events => [...events, newEvent]);

    this.matchesSignal.update(matches =>
      matches.map(m =>
        m.id === matchId
          ? { 
              ...m, 
              events: [...m.events, newEvent],
              homeScore: this.calculateScore(matchId, m.homeTeam, [...m.events, newEvent]),
              awayScore: this.calculateScore(matchId, m.awayTeam, [...m.events, newEvent]),
              updatedAt: new Date()
            }
          : m
      )
    );

    return newEvent.id;
  }

  getMatchById(id: string): Match | undefined {
    return this.matchesSignal().find(match => match.id === id);
  }

  getMatchesByTeam(teamId: string): Match[] {
    return this.matchesSignal().filter(match => 
      match.homeTeam === teamId || match.awayTeam === teamId
    );
  }

  getEventsByMatch(matchId: string): MatchEvent[] {
    return this.eventsSignal().filter(event => event.matchId === matchId);
  }

  getMatchResults(): MatchResult[] {
    return this.finishedMatches().map(match => ({
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      date: match.date,
      winner: match.homeScore > match.awayScore ? match.homeTeam :
              match.awayScore > match.homeScore ? match.awayTeam : undefined
    }));
  }

  simulateMatchProgress(matchId: string): void {
    const match = this.getMatchById(matchId);
    if (!match || match.status !== MatchStatus.LIVE) return;

    const eventTypes = [EventType.GOAL, EventType.YELLOW_CARD, EventType.SUBSTITUTION];
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomMinute = Math.floor(Math.random() * 90) + 1;
    const isHomeTeam = Math.random() > 0.5;

    this.registerEvent(matchId, {
      type: randomEvent,
      playerId: this.generateId(),
      playerName: `Jogador ${Math.floor(Math.random() * 100)}`,
      teamId: isHomeTeam ? match.homeTeam : match.awayTeam,
      minute: randomMinute,
      description: `${randomEvent} aos ${randomMinute} minutos`
    });
  }

  private calculateScore(matchId: string, teamId: string, events: MatchEvent[]): number {
    return events.filter(event => 
      event.matchId === matchId && 
      event.teamId === teamId && 
      event.type === EventType.GOAL
    ).length;
  }

  private loadMockData(): void {
    const mockMatches: Match[] = [
      {
        id: '1',
        homeTeam: '1',
        awayTeam: '2',
        date: new Date(Date.now() + 86400000),
        stadium: 'Maracanã',
        status: MatchStatus.SCHEDULED,
        homeScore: 0,
        awayScore: 0,
        events: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        homeTeam: '2',
        awayTeam: '1',
        date: new Date(Date.now() - 86400000),
        stadium: 'Allianz Parque',
        status: MatchStatus.FINISHED,
        homeScore: 2,
        awayScore: 1,
        events: [
          {
            id: '1',
            matchId: '2',
            type: EventType.GOAL,
            playerId: '2',
            playerName: 'Endrick',
            teamId: '2',
            minute: 15,
            description: 'Gol aos 15 minutos',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '2',
            matchId: '2',
            type: EventType.GOAL,
            playerId: '1',
            playerName: 'Gabriel Barbosa',
            teamId: '1',
            minute: 45,
            description: 'Gol aos 45 minutos',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '3',
            matchId: '2',
            type: EventType.GOAL,
            playerId: '2',
            playerName: 'Endrick',
            teamId: '2',
            minute: 78,
            description: 'Gol aos 78 minutos',
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ];

    this.matchesSignal.set(mockMatches);
    this.eventsSignal.set(mockMatches.flatMap(match => match.events));
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
