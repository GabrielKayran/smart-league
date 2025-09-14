import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { DatePipe } from "@angular/common";
import { MatchService } from "@core/services/match.service";
import { TeamService } from "@core/services/team.service";
import {
  Match,
  MatchEvent,
  MatchStatus,
} from "@shared/interfaces/match.interface";

@Component({
  selector: "app-match-detail",
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    DatePipe,
    RouterModule,
  ],
  templateUrl: "./match-detail.component.html",
  styleUrl: "./match-detail.component.scss",
})
export class MatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private matchService = inject(MatchService);
  private teamService = inject(TeamService);

  match: Match | null = null;

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get("id");
    if (matchId) {
      this.loadMatchData(matchId);
    }
  }

  private loadMatchData(matchId: string): void {
    const matches = this.matchService.matches();
    this.match = matches.find((m) => m.id === matchId) || null;
  }

  getTeamName(teamId: string): string {
    const teams = this.teamService.teams();
    const team = teams.find((t) => t.id === teamId);
    return team?.name || "Time não encontrado";
  }

  getStatusChipClass(): string {
    if (!this.match) return "";

    switch (this.match.status) {
      case "Agendada":
        return "chip-scheduled";
      case "Finalizada":
        return "chip-finished";
      case "Cancelada":
        return "chip-cancelled";
      default:
        return "";
    }
  }

  getEventTypeClass(eventType: string): string {
    switch (eventType) {
      case "Gol":
        return "goal";
      case "Cartão Amarelo":
        return "yellow-card";
      case "Cartão Vermelho":
        return "red-card";
      case "Substituição":
        return "substitution";
      default:
        return "";
    }
  }

  getEventIcon(eventType: string): string {
    switch (eventType) {
      case "Gol":
        return "sports_soccer";
      case "Cartão Amarelo":
        return "crop_portrait";
      case "Cartão Vermelho":
        return "crop_portrait";
      case "Substituição":
        return "swap_horiz";
      default:
        return "event";
    }
  }

  getEventDescription(event: MatchEvent): string {
    switch (event.type) {
      case "Gol":
        return `Gol marcado${event.assistPlayerId ? " com assistência" : ""}`;
      case "Cartão Amarelo":
        return "Cartão amarelo recebido";
      case "Cartão Vermelho":
        return "Cartão vermelho recebido";
      case "Substituição":
        return `Substituição - Saiu: ${event.playerName}`;
      default:
        return event.type;
    }
  }

  goBack(): void {
    this.router.navigate(["/matches"]);
  }

  startMatch(): void {
    if (this.match) {
      this.matchService.updateMatchStatus(this.match.id, MatchStatus.LIVE);
      this.loadMatchData(this.match.id);
    }
  }

  endMatch(): void {
    if (this.match) {
      this.matchService.updateMatchStatus(this.match.id, MatchStatus.FINISHED);
      this.loadMatchData(this.match.id);
    }
  }

  addEvent(): void {
    console.log("Adicionar evento");
  }

  editMatch(): void {
    if (this.match) {
      this.router.navigate(["/matches", "edit", this.match.id]);
    }
  }
}
