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
        name: 'Flamengo',
        foundedYear: 1895,
        stadium: 'Maracanã',
        city: 'Rio de Janeiro',
        players: [],
        statistics: { matches: 10, wins: 7, draws: 2, losses: 1, goalsFor: 25, goalsAgainst: 8, points: 23, goalDifference: 17 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Palmeiras',
        foundedYear: 1914,
        stadium: 'Allianz Parque',
        city: 'São Paulo',
        players: [],
        statistics: { matches: 10, wins: 6, draws: 3, losses: 1, goalsFor: 20, goalsAgainst: 10, points: 21, goalDifference: 10 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      }
    ];

    const mockPlayers: Player[] = [
      {
        id: '1',
        name: 'Gabriel Barbosa',
        position: PlayerPosition.FORWARD,
        number: 9,
        age: 27,
        teamId: '1',
        statistics: { matches: 10, goals: 12, assists: 3, yellowCards: 2, redCards: 0, minutesPlayed: 850 },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Endrick',
        position: PlayerPosition.FORWARD,
        number: 11,
        age: 18,
        teamId: '2',
        statistics: { matches: 8, goals: 8, assists: 2, yellowCards: 1, redCards: 0, minutesPlayed: 650 },
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
