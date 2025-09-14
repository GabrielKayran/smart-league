import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TeamService } from '@core/services/team.service';
import { MatchService } from '@core/services/match.service';
import { NotificationService } from '@core/services/notification.service';
import { RankingService } from '@core/services/ranking.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  teamService = inject(TeamService);
  matchService = inject(MatchService);
  notificationService = inject(NotificationService);
  rankingService = inject(RankingService);

  getTeamName(teamId: string): string {
    const team = this.teamService.getTeamById(teamId);
    return team?.name || 'Time Desconhecido';
  }
}
