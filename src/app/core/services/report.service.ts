import { Injectable, computed, inject } from '@angular/core';
import { TeamService } from './team.service';
import { MatchService } from './match.service';
import { RankingService } from './ranking.service';
import { Player, Team } from '@shared/interfaces/team.interface';
import { Match } from '@shared/interfaces/match.interface';

export interface PlayerReport {
  player: Player;
  team: Team;
  averageGoalsPerMatch: number;
  averageAssistsPerMatch: number;
  disciplinaryRecord: string;
  recentMatches: Match[];
  performanceRating: number;
}

export interface TeamReport {
  team: Team;
  currentPosition: number;
  homeRecord: { wins: number; draws: number; losses: number; };
  awayRecord: { wins: number; draws: number; losses: number; };
  goalScoringAverage: number;
  defensiveAverage: number;
  topScorer: Player | null;
  recentForm: string[];
  upcomingMatches: Match[];
}

export interface LeagueReport {
  totalMatches: number;
  totalGoals: number;
  averageGoalsPerMatch: number;
  mostWins: Team | null;
  bestAttack: Team | null;
  bestDefense: Team | null;
  fairPlayRanking: Team[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private teamService = inject(TeamService);
  private matchService = inject(MatchService);
  private rankingService = inject(RankingService);

  leagueReport = computed(() => this.generateLeagueReport());

  constructor() {}

  generatePlayerReport(playerId: string): PlayerReport | null {
    const player = this.teamService.getPlayerById(playerId);
    if (!player) return null;

    const team = this.teamService.getTeamById(player.teamId);
    if (!team) return null;

    const playerMatches = this.matchService.matches().filter(match =>
      (match.homeTeam === player.teamId || match.awayTeam === player.teamId) &&
      match.status === 'Finalizada'
    );

    const averageGoalsPerMatch = player.statistics.matches > 0 
      ? player.statistics.goals / player.statistics.matches 
      : 0;
    
    const averageAssistsPerMatch = player.statistics.matches > 0 
      ? player.statistics.assists / player.statistics.matches 
      : 0;

    const disciplinaryRecord = this.getDisciplinaryRecord(player);
    const performanceRating = this.calculatePlayerPerformance(player);

    return {
      player,
      team,
      averageGoalsPerMatch,
      averageAssistsPerMatch,
      disciplinaryRecord,
      recentMatches: playerMatches.slice(-5),
      performanceRating
    };
  }

  generateTeamReport(teamId: string): TeamReport | null {
    const team = this.teamService.getTeamById(teamId);
    if (!team) return null;

    const teamMatches = this.matchService.getMatchesByTeam(teamId);
    const finishedMatches = teamMatches.filter(match => match.status === 'Finalizada');
    const upcomingMatches = teamMatches.filter(match => match.status === 'Agendada');

    const homeMatches = finishedMatches.filter(match => match.homeTeam === teamId);
    const awayMatches = finishedMatches.filter(match => match.awayTeam === teamId);

    const homeRecord = this.calculateRecord(homeMatches, teamId, true);
    const awayRecord = this.calculateRecord(awayMatches, teamId, false);

    const totalGoalsFor = team.statistics.goalsFor;
    const goalScoringAverage = finishedMatches.length > 0 
      ? totalGoalsFor / finishedMatches.length 
      : 0;

    const totalGoalsAgainst = team.statistics.goalsAgainst;
    const defensiveAverage = finishedMatches.length > 0 
      ? totalGoalsAgainst / finishedMatches.length 
      : 0;

    const topScorer = this.getTeamTopScorer(teamId);
    const currentPosition = this.rankingService.getTeamPosition(teamId);
    const recentForm = this.getRecentForm(teamId);

    return {
      team,
      currentPosition,
      homeRecord,
      awayRecord,
      goalScoringAverage,
      defensiveAverage,
      topScorer,
      recentForm,
      upcomingMatches: upcomingMatches.slice(0, 3)
    };
  }

  exportPlayerReportPDF(playerId: string): void {
    const report = this.generatePlayerReport(playerId);
    if (!report) return;

    console.log('Exportando relatório PDF para jogador:', report.player.name);
    alert(`Relatório PDF do jogador ${report.player.name} seria exportado (funcionalidade mockada)`);
  }

  exportTeamReportCSV(teamId: string): void {
    const report = this.generateTeamReport(teamId);
    if (!report) return;

    console.log('Exportando relatório CSV para time:', report.team.name);
    alert(`Relatório CSV do time ${report.team.name} seria exportado (funcionalidade mockada)`);
  }

  private generateLeagueReport(): LeagueReport {
    const teams = this.teamService.teams();
    const matches = this.matchService.finishedMatches();

    const totalMatches = matches.length;
    const totalGoals = matches.reduce((sum, match) => sum + match.homeScore + match.awayScore, 0);
    const averageGoalsPerMatch = totalMatches > 0 ? totalGoals / totalMatches : 0;

    const mostWins = teams.reduce((prev, current) => 
      (current.statistics.wins > (prev?.statistics.wins || 0)) ? current : prev, null as Team | null);

    const bestAttack = teams.reduce((prev, current) => 
      (current.statistics.goalsFor > (prev?.statistics.goalsFor || 0)) ? current : prev, null as Team | null);

    const bestDefense = teams.reduce((prev, current) => 
      (current.statistics.goalsAgainst < (prev?.statistics.goalsAgainst || Infinity)) ? current : prev, null as Team | null);

    const fairPlayRanking = [...teams].sort((a, b) => {
      const aCards = this.getTeamCardCount(a.id);
      const bCards = this.getTeamCardCount(b.id);
      return aCards - bCards;
    });

    return {
      totalMatches,
      totalGoals,
      averageGoalsPerMatch,
      mostWins,
      bestAttack,
      bestDefense,
      fairPlayRanking
    };
  }

  private getDisciplinaryRecord(player: Player): string {
    const yellow = player.statistics.yellowCards;
    const red = player.statistics.redCards;
    
    if (red > 0) return 'Ruim';
    if (yellow > 3) return 'Regular';
    if (yellow > 1) return 'Bom';
    return 'Excelente';
  }

  private calculatePlayerPerformance(player: Player): number {
    if (player.statistics.matches === 0) return 0;

    const goalRatio = player.statistics.goals / player.statistics.matches;
    const assistRatio = player.statistics.assists / player.statistics.matches;
    const disciplinaryPenalty = (player.statistics.yellowCards * 0.1) + (player.statistics.redCards * 0.5);

    const baseScore = (goalRatio * 30) + (assistRatio * 20) + 50;
    return Math.max(0, Math.min(100, baseScore - disciplinaryPenalty));
  }

  private calculateRecord(matches: Match[], teamId: string, isHome: boolean) {
    let wins = 0, draws = 0, losses = 0;

    matches.forEach(match => {
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      if (teamScore > opponentScore) wins++;
      else if (teamScore === opponentScore) draws++;
      else losses++;
    });

    return { wins, draws, losses };
  }

  private getTeamTopScorer(teamId: string): Player | null {
    const players = this.teamService.getPlayersByTeam(teamId);
    return players.reduce((top, current) => 
      (current.statistics.goals > (top?.statistics.goals || 0)) ? current : top, null as Player | null);
  }

  private getRecentForm(teamId: string): string[] {
    const matches = this.matchService.getMatchesByTeam(teamId)
      .filter(match => match.status === 'Finalizada')
      .slice(-5);

    return matches.map(match => {
      const isHome = match.homeTeam === teamId;
      const teamScore = isHome ? match.homeScore : match.awayScore;
      const opponentScore = isHome ? match.awayScore : match.homeScore;

      if (teamScore > opponentScore) return 'V';
      if (teamScore === opponentScore) return 'E';
      return 'D';
    });
  }

  private getTeamCardCount(teamId: string): number {
    const players = this.teamService.getPlayersByTeam(teamId);
    return players.reduce((total, player) => 
      total + player.statistics.yellowCards + (player.statistics.redCards * 2), 0);
  }
}
