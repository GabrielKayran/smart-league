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
      // Próximas partidas
      {
        id: '1',
        homeTeam: '1',
        awayTeam: '2',
        date: new Date(Date.now() + 86400000),
        stadium: 'Campo do Seu Zé',
        status: MatchStatus.SCHEDULED,
        homeScore: 0,
        awayScore: 0,
        events: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        homeTeam: '3',
        awayTeam: '4',
        date: new Date(Date.now() + 172800000),
        stadium: 'Campo da Praça',
        status: MatchStatus.SCHEDULED,
        homeScore: 0,
        awayScore: 0,
        events: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '3',
        homeTeam: '5',
        awayTeam: '6',
        date: new Date(Date.now() + 259200000),
        stadium: 'Campinho do Parque',
        status: MatchStatus.SCHEDULED,
        homeScore: 0,
        awayScore: 0,
        events: [],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      
      // Partidas finalizadas
      {
        id: '4',
        homeTeam: '2',
        awayTeam: '1',
        date: new Date(Date.now() - 86400000),
        stadium: 'Quadra da Escola',
        status: MatchStatus.FINISHED,
        homeScore: 3,
        awayScore: 1,
        events: [
          {
            id: '1',
            matchId: '4',
            type: EventType.GOAL,
            playerId: '5',
            playerName: 'Pedrinho da Curva',
            teamId: '2',
            minute: 15,
            description: 'Gol de cabeça após escanteio',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '2',
            matchId: '4',
            type: EventType.GOAL,
            playerId: '1',
            playerName: 'Juninho Perna Torta',
            teamId: '1',
            minute: 32,
            description: 'Gol de falta no ângulo',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '3',
            matchId: '4',
            type: EventType.YELLOW_CARD,
            playerId: '3',
            playerName: 'Zagueiro Naldinho',
            teamId: '1',
            minute: 58,
            description: 'Cartão por reclamação',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '4',
            matchId: '4',
            type: EventType.GOAL,
            playerId: '6',
            playerName: 'Robertão Canhoto',
            teamId: '2',
            minute: 73,
            description: 'Gol de bicicleta',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '5',
            matchId: '4',
            type: EventType.GOAL,
            playerId: '5',
            playerName: 'Pedrinho da Curva',
            teamId: '2',
            minute: 89,
            description: 'Gol nos acréscimos',
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '5',
        homeTeam: '3',
        awayTeam: '5',
        date: new Date(Date.now() - 172800000),
        stadium: 'Campo da Praça',
        status: MatchStatus.FINISHED,
        homeScore: 2,
        awayScore: 2,
        events: [
          {
            id: '6',
            matchId: '5',
            type: EventType.GOAL,
            playerId: '9',
            playerName: 'Thiaguinho Artilheiro',
            teamId: '3',
            minute: 8,
            description: 'Gol logo no início',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '7',
            matchId: '5',
            type: EventType.GOAL,
            playerId: '9',
            playerName: 'Thiaguinho Artilheiro',
            teamId: '3',
            minute: 34,
            description: 'Segundo gol do Thiaguinho',
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '6',
        homeTeam: '4',
        awayTeam: '6',
        date: new Date(Date.now() - 259200000),
        stadium: 'Campo do Bairro',
        status: MatchStatus.FINISHED,
        homeScore: 1,
        awayScore: 0,
        events: [
          {
            id: '8',
            matchId: '6',
            type: EventType.GOAL,
            playerId: '11',
            playerName: 'Lelê do Gol',
            teamId: '4',
            minute: 67,
            description: 'Gol solitário da partida',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '9',
            matchId: '6',
            type: EventType.RED_CARD,
            playerId: '12',
            playerName: 'Paulinho Volante',
            teamId: '4',
            minute: 85,
            description: 'Expulso por segunda amarela',
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '7',
        homeTeam: '1',
        awayTeam: '3',
        date: new Date(Date.now() - 345600000),
        stadium: 'Campo do Seu Zé',
        status: MatchStatus.FINISHED,
        homeScore: 4,
        awayScore: 2,
        events: [
          {
            id: '10',
            matchId: '7',
            type: EventType.GOAL,
            playerId: '1',
            playerName: 'Juninho Perna Torta',
            teamId: '1',
            minute: 12,
            description: 'Hat-trick do Juninho - 1º gol',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '11',
            matchId: '7',
            type: EventType.GOAL,
            playerId: '1',
            playerName: 'Juninho Perna Torta',
            teamId: '1',
            minute: 28,
            description: 'Hat-trick do Juninho - 2º gol',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '12',
            matchId: '7',
            type: EventType.GOAL,
            playerId: '9',
            playerName: 'Thiaguinho Artilheiro',
            teamId: '3',
            minute: 41,
            description: 'Desconto do Thiaguinho',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '13',
            matchId: '7',
            type: EventType.GOAL,
            playerId: '1',
            playerName: 'Juninho Perna Torta',
            teamId: '1',
            minute: 55,
            description: 'Hat-trick do Juninho - 3º gol!',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '14',
            matchId: '7',
            type: EventType.GOAL,
            playerId: '2',
            playerName: 'Carlinhos Bicicleta',
            teamId: '1',
            minute: 78,
            description: 'Golaço de bicicleta',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '15',
            matchId: '7',
            type: EventType.GOAL,
            playerId: '10',
            playerName: 'Marquinhos Gambeta',
            teamId: '3',
            minute: 90,
            description: 'Gol de honra nos acréscimos',
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '8',
        homeTeam: '2',
        awayTeam: '4',
        date: new Date(Date.now() - 432000000),
        stadium: 'Quadra da Escola',
        status: MatchStatus.FINISHED,
        homeScore: 2,
        awayScore: 1,
        events: [
          {
            id: '16',
            matchId: '8',
            type: EventType.GOAL,
            playerId: '6',
            playerName: 'Robertão Canhoto',
            teamId: '2',
            minute: 23,
            description: 'Gol de canhota',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '17',
            matchId: '8',
            type: EventType.GOAL,
            playerId: '11',
            playerName: 'Lelê do Gol',
            teamId: '4',
            minute: 67,
            description: 'Empate do Lelê',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '18',
            matchId: '8',
            type: EventType.GOAL,
            playerId: '5',
            playerName: 'Pedrinho da Curva',
            teamId: '2',
            minute: 84,
            description: 'Gol da vitória',
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '9',
        homeTeam: '5',
        awayTeam: '1',
        date: new Date(Date.now() - 518400000),
        stadium: 'Campinho do Parque',
        status: MatchStatus.FINISHED,
        homeScore: 0,
        awayScore: 3,
        events: [
          {
            id: '19',
            matchId: '9',
            type: EventType.GOAL,
            playerId: '2',
            playerName: 'Carlinhos Bicicleta',
            teamId: '1',
            minute: 15,
            description: 'Abertura do placar',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '20',
            matchId: '9',
            type: EventType.GOAL,
            playerId: '1',
            playerName: 'Juninho Perna Torta',
            teamId: '1',
            minute: 45,
            description: 'Gol antes do intervalo',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '21',
            matchId: '9',
            type: EventType.GOAL,
            playerId: '1',
            playerName: 'Juninho Perna Torta',
            teamId: '1',
            minute: 71,
            description: 'Fechou a conta',
            createdAt: new Date('2024-01-01')
          }
        ],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '10',
        homeTeam: '6',
        awayTeam: '3',
        date: new Date(Date.now() - 604800000),
        stadium: 'Campo da Igreja',
        status: MatchStatus.FINISHED,
        homeScore: 1,
        awayScore: 2,
        events: [
          {
            id: '22',
            matchId: '10',
            type: EventType.GOAL,
            playerId: '9',
            playerName: 'Thiaguinho Artilheiro',
            teamId: '3',
            minute: 22,
            description: 'Thiaguinho não perdoa',
            createdAt: new Date('2024-01-01')
          },
          {
            id: '23',
            matchId: '10',
            type: EventType.GOAL,
            playerId: '10',
            playerName: 'Marquinhos Gambeta',
            teamId: '3',
            minute: 58,
            description: 'Ampliou o placar',
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
