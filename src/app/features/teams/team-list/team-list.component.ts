import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTableModule, RouterModule],
  templateUrl: './team-list.component.html',
  styleUrl: './team-list.component.scss'
})
export class TeamListComponent {
  teamService = inject(TeamService);

  getPlayerCount(teamId: string): number {
    return this.teamService.getPlayersByTeam(teamId).length;
  }
}
