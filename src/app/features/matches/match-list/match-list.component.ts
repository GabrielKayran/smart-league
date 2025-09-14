import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatchService } from '@core/services/match.service';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterModule, DatePipe],
  templateUrl: './match-list.component.html',
  styleUrl: './match-list.component.scss'
})
export class MatchListComponent {
  matchService = inject(MatchService);
  private teamService = inject(TeamService);

  getTeamName(teamId: string): string {
    const teams = this.teamService.teams();
    const team = teams.find(t => t.id === teamId);
    return team?.name || 'Time não encontrado';
  }
}