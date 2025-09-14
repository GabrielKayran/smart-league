import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { TeamService } from "@core/services/team.service";
import { RankingService } from "@core/services/ranking.service";
import { MatchService } from "@core/services/match.service";
import { Team, Player } from "@shared/interfaces/team.interface";
import { Match } from "@shared/interfaces/match.interface";
import { DatePipe, DecimalPipe } from "@angular/common";

@Component({
  selector: "app-team-detail",
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    RouterModule,
    DatePipe,
    DecimalPipe,
  ],
  templateUrl: "./team-detail.component.html",
  styleUrl: "./team-detail.component.scss",
})
export class TeamDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamService = inject(TeamService);
  private rankingService = inject(RankingService);
  private matchService = inject(MatchService);

  team: Team | null = null;
  players: Player[] = [];
  teamPlayers: Player[] = [];
  teamMatches: Match[] = [];

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get("id");
    if (teamId) {
      this.loadTeamData(teamId);
    }
  }

  private loadTeamData(teamId: string): void {
    const teams = this.teamService.teams();
    this.team = teams.find((t) => t.id === teamId) || null;

    if (this.team) {
      const allPlayers = this.teamService.players();
      this.players = allPlayers.filter((p) => p.teamId === teamId);
      this.teamPlayers = this.players; // Alias para compatibilidade com template
      
      // Carregar partidas do time
      const allMatches = this.matchService.matches();
      this.teamMatches = allMatches.filter((m) => 
        m.homeTeam === teamId || m.awayTeam === teamId
      );
    }
  }

  goBack(): void {
    this.router.navigate(["/teams"]);
  }

  getTeamPosition(): number {
    if (!this.team) return 0;
    return this.rankingService.getTeamPosition(this.team.id);
  }

  getGoalsAverage(): string {
    if (!this.team || this.team.statistics.matches === 0) return "0.0";
    return (
      this.team.statistics.goalsFor / this.team.statistics.matches
    ).toFixed(1);
  }

  getDefensiveAverage(): string {
    if (!this.team || this.team.statistics.matches === 0) return "0.0";
    return (
      this.team.statistics.goalsAgainst / this.team.statistics.matches
    ).toFixed(1);
  }

  getTopScorer(): string {
    if (this.players.length === 0) return "Nenhum";
    const topScorer = this.players.reduce((top, current) =>
      current.statistics.goals > top.statistics.goals ? current : top,
    );
    return topScorer.statistics.goals > 0 ? topScorer.name : "Nenhum";
  }

  getGoalDifferenceClass(): string {
    if (!this.team) return "";
    if (this.team.statistics.goalDifference > 0) return "positive";
    if (this.team.statistics.goalDifference < 0) return "negative";
    return "";
  }

  getTeamName(teamId: string): string {
    const teams = this.teamService.teams();
    const team = teams.find((t) => t.id === teamId);
    return team?.name || "Time não encontrado";
  }

  getTotalGoals(): number {
    return this.teamPlayers.reduce((total, player) => total + (player.statistics.goals || 0), 0);
  }

  getTotalAssists(): number {
    return this.teamPlayers.reduce((total, player) => total + (player.statistics.assists || 0), 0);
  }

  getAverageAge(): number {
    if (this.teamPlayers.length === 0) return 0;
    const totalAge = this.teamPlayers.reduce((total, player) => total + player.age, 0);
    return totalAge / this.teamPlayers.length;
  }
}
