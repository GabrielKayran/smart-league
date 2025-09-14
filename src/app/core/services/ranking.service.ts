import { Injectable, signal, computed, inject } from '@angular/core';
import { RankingEntry, LeagueStandings, TopScorer, TopAssists } from '@shared/interfaces/ranking.interface';
import { MatchService } from './match.service';
import { TeamService } from './team.service';

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private matchService = inject(MatchService);
  private teamService = inject(TeamService);

  private standingsSignal = signal<LeagueStandings>({
    season: '2024',
    lastUpdated: new Date(),
    entries: []
  });

  standings = this.standingsSignal.asReadonly();

  topScorers = computed(() => this.calculateTopScorers());
  topAssists = computed(() => this.calculateTopAssists());

  constructor() {
    this.calculateStandings();
    
    setTimeout(() => {
      this.loadMockData();
    }, 100);
  }

  calculateStandings(): void {
    const teams = this.teamService.teams();
    const matches = this.matchService.finishedMatches();

    const entries: RankingEntry[] = teams.map(team => {
      const teamMatches = matches.filter(match => 
        match.homeTeam === team.id || match.awayTeam === team.id
      );

      let wins = 0;
      let draws = 0;
      let losses = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      teamMatches.forEach(match => {
        const isHome = match.homeTeam === team.id;
        const teamScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;

        goalsFor += teamScore;
        goalsAgainst += opponentScore;

        if (teamScore > opponentScore) {
          wins++;
        } else if (teamScore === opponentScore) {
          draws++;
        } else {
          losses++;
        }
      });

      const points = wins * 3 + draws;
      const goalDifference = goalsFor - goalsAgainst;

      return {
        position: 0,
        teamId: team.id,
        teamName: team.name,
        teamLogo: team.logo,
        matches: teamMatches.length,
        wins,
        draws,
        losses,
        goalsFor,
        goalsAgainst,
        goalDifference,
        points,
        form: this.getRecentForm(team.id, matches.slice(-5))
      };
    });

    entries.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
      return b.goalsFor - a.goalsFor;
    });

    entries.forEach((entry, index) => {
      entry.position = index + 1;
    });

    this.standingsSignal.update(standings => ({
      ...standings,
      entries,
      lastUpdated: new Date()
    }));
  }

  getTeamPosition(teamId: string): number {
    const entry = this.standings().entries.find(entry => entry.teamId === teamId);
    return entry?.position || 0;
  }

  getTeamStats(teamId: string): RankingEntry | undefined {
    return this.standings().entries.find(entry => entry.teamId === teamId);
  }

  private calculateTopScorers(): TopScorer[] {
    const players = this.teamService.players();
    const teams = this.teamService.teams();

    return players
      .map(player => {
        const team = teams.find(t => t.id === player.teamId);
        return {
          playerId: player.id,
          playerName: player.name,
          teamName: team?.name || 'Time Desconhecido',
          goals: player.statistics.goals,
          matches: player.statistics.matches,
          photo: player.photo
        };
      })
      .filter(scorer => scorer.goals > 0)
      .sort((a, b) => b.goals - a.goals)
      .slice(0, 10);
  }

  private calculateTopAssists(): TopAssists[] {
    const players = this.teamService.players();
    const teams = this.teamService.teams();

    return players
      .map(player => {
        const team = teams.find(t => t.id === player.teamId);
        return {
          playerId: player.id,
          playerName: player.name,
          teamName: team?.name || 'Time Desconhecido',
          assists: player.statistics.assists,
          matches: player.statistics.matches,
          photo: player.photo
        };
      })
      .filter(assist => assist.assists > 0)
      .sort((a, b) => b.assists - a.assists)
      .slice(0, 10);
  }

  private getRecentForm(teamId: string, recentMatches: any[]): any[] {
    return recentMatches
      .filter(match => match.homeTeam === teamId || match.awayTeam === teamId)
      .slice(-5)
      .map(match => {
        const isHome = match.homeTeam === teamId;
        const teamScore = isHome ? match.homeScore : match.awayScore;
        const opponentScore = isHome ? match.awayScore : match.homeScore;
        const opponentId = isHome ? match.awayTeam : match.homeTeam;
        const opponent = this.teamService.getTeamById(opponentId);

        let result: 'W' | 'D' | 'L';
        if (teamScore > opponentScore) result = 'W';
        else if (teamScore === opponentScore) result = 'D';
        else result = 'L';

        return {
          result,
          opponent: opponent?.name || 'Desconhecido',
          score: `${teamScore}-${opponentScore}`
        };
      });
  }

  private loadMockData(): void {
    this.calculateStandings();
  }
}
