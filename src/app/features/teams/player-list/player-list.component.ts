import { Component, inject } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatChipsModule } from "@angular/material/chips";
import { RouterModule } from "@angular/router";
import { TeamService } from "@core/services/team.service";

@Component({
  selector: "app-player-list",
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    RouterModule,
  ],
  templateUrl: "./player-list.component.html",
  styleUrl: "./player-list.component.scss",
})
export class PlayerListComponent {
  teamService = inject(TeamService);

  getTeamName(teamId: string): string {
    const team = this.teamService.getTeamById(teamId);
    return team?.name || "Time Desconhecido";
  }
}
