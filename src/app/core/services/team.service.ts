import { Injectable, signal, computed } from '@angular/core';
import { Team, Player, PlayerPosition, TeamStatistics, PlayerStatistics } from '@shared/interfaces/team.interface';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private teamsSignal = signal<Team[]>([]);
  private playersSignal = signal<Player[]>([]);

  teams = this.teamsSignal.asReadonly();
  players = this.playersSignal.asReadonly();

  teamCount = computed(() => this.teamsSignal().length);
  playerCount = computed(() => this.playersSignal().length);

  constructor() {
    this.loadMockData();
  }

  addTeam(teamData: Omit<Team, 'id' | 'players' | 'statistics' | 'createdAt' | 'updatedAt'>): string {
    const newTeam: Team = {
      ...teamData,
      id: this.generateId(),
      players: [],
      statistics: this.createEmptyStatistics(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.teamsSignal.update(teams => [...teams, newTeam]);
    return newTeam.id;
  }

  addPlayer(playerData: Omit<Player, 'id' | 'statistics' | 'createdAt' | 'updatedAt'>): string {
    const newPlayer: Player = {
      ...playerData,
      id: this.generateId(),
      statistics: this.createEmptyPlayerStatistics(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.playersSignal.update(players => [...players, newPlayer]);
    
    this.teamsSignal.update(teams => 
      teams.map(team => 
        team.id === playerData.teamId 
          ? { ...team, players: [...team.players, newPlayer], updatedAt: new Date() }
          : team
      )
    );

    return newPlayer.id;
  }

  getTeamById(id: string): Team | undefined {
    return this.teamsSignal().find(team => team.id === id);
  }

  getPlayerById(id: string): Player | undefined {
    return this.playersSignal().find(player => player.id === id);
  }

  getPlayersByTeam(teamId: string): Player[] {
    return this.playersSignal().filter(player => player.teamId === teamId);
  }

  updateTeam(id: string, updates: Partial<Team>): boolean {
    const teamExists = this.teamsSignal().some(team => team.id === id);
    if (!teamExists) return false;

    this.teamsSignal.update(teams =>
      teams.map(team =>
        team.id === id 
          ? { ...team, ...updates, updatedAt: new Date() }
          : team
      )
    );
    return true;
  }

  updatePlayer(id: string, updates: Partial<Player>): boolean {
    const playerExists = this.playersSignal().some(player => player.id === id);
    if (!playerExists) return false;

    this.playersSignal.update(players =>
      players.map(player =>
        player.id === id 
          ? { ...player, ...updates, updatedAt: new Date() }
          : player
      )
    );
    return true;
  }

  deleteTeam(id: string): boolean {
    const teamExists = this.teamsSignal().some(team => team.id === id);
    if (!teamExists) return false;

    this.teamsSignal.update(teams => teams.filter(team => team.id !== id));
    this.playersSignal.update(players => players.filter(player => player.teamId !== id));
    return true;
  }

  deletePlayer(id: string): boolean {
    const player = this.getPlayerById(id);
    if (!player) return false;

    this.playersSignal.update(players => players.filter(p => p.id !== id));
    
    this.teamsSignal.update(teams =>
      teams.map(team =>
        team.id === player.teamId
          ? { ...team, players: team.players.filter(p => p.id !== id), updatedAt: new Date() }
          : team
      )
    );
    return true;
  }

  private loadMockData(): void {
    const mockTeams: Team[] = [
      {
        id: '1',
        name: 'Unidos do Angular FC',
        foundedYear: 2018,
        stadium: 'Campo do Seu Zé',
        city: 'Vila Madalena - SP',
        players: [],
        statistics: { matches: 15, wins: 8, draws: 4, losses: 3, goalsFor: 24, goalsAgainst: 18, points: 28, goalDifference: 6 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Raça e Pegada',
        foundedYear: 2015,
        stadium: 'Quadra da Escola',
        city: 'Capão Redondo - SP',
        players: [],
        statistics: { matches: 15, wins: 9, draws: 3, losses: 3, goalsFor: 27, goalsAgainst: 16, points: 30, goalDifference: 11 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Garotos da Vila',
        foundedYear: 2020,
        stadium: 'Campo da Praça',
        city: 'Vila das Belezas - SP',
        players: [],
        statistics: { matches: 15, wins: 7, draws: 5, losses: 3, goalsFor: 21, goalsAgainst: 17, points: 26, goalDifference: 4 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Beira Rio FC',
        foundedYear: 2017,
        stadium: 'Campo do Bairro',
        city: 'Cidade Tiradentes - SP',
        players: [],
        statistics: { matches: 15, wins: 6, draws: 6, losses: 3, goalsFor: 19, goalsAgainst: 18, points: 24, goalDifference: 1 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '5',
        name: 'Só Alegria',
        foundedYear: 2019,
        stadium: 'Campinho do Parque',
        city: 'Jardim Ângela - SP',
        players: [],
        statistics: { matches: 15, wins: 5, draws: 4, losses: 6, goalsFor: 17, goalsAgainst: 22, points: 19, goalDifference: -5 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '6',
        name: 'Força Jovem',
        foundedYear: 2021,
        stadium: 'Campo da Igreja',
        city: 'Guaianases - SP',
        players: [],
        statistics: { matches: 15, wins: 4, draws: 3, losses: 8, goalsFor: 15, goalsAgainst: 25, points: 15, goalDifference: -10 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ];

    const mockPlayers: Player[] = [
      // Unidos do Angular FC
      {
        id: '1',
        name: 'Juninho Perna Torta',
        position: PlayerPosition.FORWARD,
        number: 9,
        age: 29,
        teamId: '1',
        statistics: { matches: 12, goals: 8, assists: 3, yellowCards: 2, redCards: 0, minutesPlayed: 1020 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Carlinhos Bicicleta',
        position: PlayerPosition.MIDFIELDER,
        number: 10,
        age: 32,
        teamId: '1',
        statistics: { matches: 14, goals: 5, assists: 7, yellowCards: 3, redCards: 0, minutesPlayed: 1200 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Zagueiro Naldinho',
        position: PlayerPosition.DEFENDER,
        number: 4,
        age: 35,
        teamId: '1',
        statistics: { matches: 15, goals: 2, assists: 1, yellowCards: 4, redCards: 1, minutesPlayed: 1300 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Goleiro Frangão',
        position: PlayerPosition.GOALKEEPER,
        number: 1,
        age: 38,
        teamId: '1',
        statistics: { matches: 15, goals: 0, assists: 0, yellowCards: 1, redCards: 0, minutesPlayed: 1350 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      // Raça e Pegada
      {
        id: '5',
        name: 'Pedrinho da Curva',
        position: PlayerPosition.FORWARD,
        number: 11,
        age: 26,
        teamId: '2',
        statistics: { matches: 13, goals: 9, assists: 4, yellowCards: 1, redCards: 0, minutesPlayed: 1100 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '6',
        name: 'Robertão Canhoto',
        position: PlayerPosition.MIDFIELDER,
        number: 8,
        age: 30,
        teamId: '2',
        statistics: { matches: 15, goals: 4, assists: 8, yellowCards: 2, redCards: 0, minutesPlayed: 1280 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '7',
        name: 'Fabinho Muralha',
        position: PlayerPosition.DEFENDER,
        number: 3,
        age: 33,
        teamId: '2',
        statistics: { matches: 14, goals: 1, assists: 2, yellowCards: 3, redCards: 0, minutesPlayed: 1200 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '8',
        name: 'Jeferson Luvas',
        position: PlayerPosition.GOALKEEPER,
        number: 12,
        age: 28,
        teamId: '2',
        statistics: { matches: 15, goals: 0, assists: 1, yellowCards: 0, redCards: 0, minutesPlayed: 1350 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      // Garotos da Vila
      {
        id: '9',
        name: 'Thiaguinho Artilheiro',
        position: PlayerPosition.FORWARD,
        number: 7,
        age: 24,
        teamId: '3',
        statistics: { matches: 14, goals: 6, assists: 3, yellowCards: 2, redCards: 0, minutesPlayed: 1180 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '10',
        name: 'Marquinhos Gambeta',
        position: PlayerPosition.MIDFIELDER,
        number: 20,
        age: 27,
        teamId: '3',
        statistics: { matches: 13, goals: 3, assists: 5, yellowCards: 1, redCards: 0, minutesPlayed: 1050 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      // Beira Rio FC
      {
        id: '11',
        name: 'Lelê do Gol',
        position: PlayerPosition.FORWARD,
        number: 99,
        age: 31,
        teamId: '4',
        statistics: { matches: 12, goals: 5, assists: 2, yellowCards: 3, redCards: 0, minutesPlayed: 980 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '12',
        name: 'Paulinho Volante',
        position: PlayerPosition.MIDFIELDER,
        number: 5,
        age: 34,
        teamId: '4',
        statistics: { matches: 15, goals: 2, assists: 4, yellowCards: 5, redCards: 0, minutesPlayed: 1300 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ];

    this.teamsSignal.set(mockTeams);
    this.playersSignal.set(mockPlayers);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private createEmptyStatistics(): TeamStatistics {
    return {
      matches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
      goalDifference: 0
    };
  }

  private createEmptyPlayerStatistics(): PlayerStatistics {
    return {
      matches: 0,
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
      minutesPlayed: 0
    };
  }
}
