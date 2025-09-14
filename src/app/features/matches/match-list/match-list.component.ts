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
  template: `
    <div class="match-list-container">
      <div class="header">
        <h1>Partidas</h1>
        <button mat-raised-button color="primary" routerLink="/matches/create">
          <mat-icon>add</mat-icon>
          Nova Partida
        </button>
      </div>

      @if (matchService.matches().length === 0) {
        <mat-card class="empty-state">
          <mat-card-content>
            <mat-icon class="empty-icon">sports_soccer</mat-icon>
            <h2>Nenhuma partida agendada</h2>
            <p>Comece criando a primeira partida da liga!</p>
            <button mat-raised-button color="primary" routerLink="/matches/create">
              Criar Primeira Partida
            </button>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="matches-sections">
          <!-- Partidas ao Vivo -->
          @if (matchService.liveMatches().length > 0) {
            <div class="section">
              <h2>
                <mat-icon>play_circle</mat-icon>
                Partidas ao Vivo
              </h2>
              <div class="matches-grid">
                @for (match of matchService.liveMatches(); track match.id) {
                  <mat-card class="match-card live" [routerLink]="['/matches', match.id]">
                    <mat-card-content>
                      <div class="match-header">
                        <mat-chip class="status-chip live">AO VIVO</mat-chip>
                        <span class="match-date">{{ match.date | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                      <div class="match-teams">
                        <div class="team home">
                          <span class="team-name">{{ getTeamName(match.homeTeam) }}</span>
                          <span class="score">{{ match.homeScore }}</span>
                        </div>
                        <div class="vs">X</div>
                        <div class="team away">
                          <span class="score">{{ match.awayScore }}</span>
                          <span class="team-name">{{ getTeamName(match.awayTeam) }}</span>
                        </div>
                      </div>
                      <div class="match-venue">
                        <mat-icon>stadium</mat-icon>
                        {{ match.stadium }}
                      </div>
                    </mat-card-content>
                  </mat-card>
                }
              </div>
            </div>
          }

          <!-- Próximas Partidas -->
          @if (matchService.upcomingMatches().length > 0) {
            <div class="section">
              <h2>
                <mat-icon>schedule</mat-icon>
                Próximas Partidas
              </h2>
              <div class="matches-grid">
                @for (match of matchService.upcomingMatches(); track match.id) {
                  <mat-card class="match-card upcoming" [routerLink]="['/matches', match.id]">
                    <mat-card-content>
                      <div class="match-header">
                        <mat-chip class="status-chip upcoming">AGENDADA</mat-chip>
                        <span class="match-date">{{ match.date | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                      <div class="match-teams">
                        <div class="team home">
                          <span class="team-name">{{ getTeamName(match.homeTeam) }}</span>
                        </div>
                        <div class="vs">X</div>
                        <div class="team away">
                          <span class="team-name">{{ getTeamName(match.awayTeam) }}</span>
                        </div>
                      </div>
                      <div class="match-venue">
                        <mat-icon>stadium</mat-icon>
                        {{ match.stadium }}
                      </div>
                    </mat-card-content>
                  </mat-card>
                }
              </div>
            </div>
          }

          <!-- Partidas Finalizadas -->
          @if (matchService.finishedMatches().length > 0) {
            <div class="section">
              <h2>
                <mat-icon>check_circle</mat-icon>
                Partidas Finalizadas
              </h2>
              <div class="matches-grid">
                @for (match of matchService.finishedMatches(); track match.id) {
                  <mat-card class="match-card finished" [routerLink]="['/matches', match.id]">
                    <mat-card-content>
                      <div class="match-header">
                        <mat-chip class="status-chip finished">FINALIZADA</mat-chip>
                        <span class="match-date">{{ match.date | date:'dd/MM/yyyy HH:mm' }}</span>
                      </div>
                      <div class="match-teams">
                        <div class="team home">
                          <span class="team-name">{{ getTeamName(match.homeTeam) }}</span>
                          <span class="score">{{ match.homeScore }}</span>
                        </div>
                        <div class="vs">X</div>
                        <div class="team away">
                          <span class="score">{{ match.awayScore }}</span>
                          <span class="team-name">{{ getTeamName(match.awayTeam) }}</span>
                        </div>
                      </div>
                      <div class="match-venue">
                        <mat-icon>stadium</mat-icon>
                        {{ match.stadium }}
                      </div>
                    </mat-card-content>
                  </mat-card>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .match-list-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .empty-state {
      text-align: center;
      padding: 64px 32px;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .section {
      margin-bottom: 40px;
    }

    .section h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      color: #333;
    }

    .matches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .match-card {
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .match-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .match-card.live {
      border-left: 4px solid #4caf50;
    }

    .match-card.upcoming {
      border-left: 4px solid #ff9800;
    }

    .match-card.finished {
      border-left: 4px solid #666;
    }

    .match-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .status-chip {
      font-size: 11px;
      height: 20px;
    }

    .status-chip.live {
      background-color: #4caf50 !important;
      color: white !important;
    }

    .status-chip.upcoming {
      background-color: #ff9800 !important;
      color: white !important;
    }

    .status-chip.finished {
      background-color: #666 !important;
      color: white !important;
    }

    .match-date {
      font-size: 14px;
      color: #666;
    }

    .match-teams {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .team {
      flex: 1;
      text-align: center;
    }

    .team.home {
      text-align: left;
    }

    .team.away {
      text-align: right;
    }

    .team-name {
      display: block;
      font-weight: 500;
      margin-bottom: 4px;
    }

    .score {
      display: block;
      font-size: 24px;
      font-weight: bold;
      color: #1976d2;
    }

    .vs {
      font-weight: bold;
      color: #666;
      margin: 0 16px;
    }

    .match-venue {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
      font-size: 14px;
    }

    .match-venue mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .matches-grid {
        grid-template-columns: 1fr;
      }

      .match-teams {
        flex-direction: column;
        gap: 8px;
      }

      .team.home, .team.away {
        text-align: center;
      }

      .vs {
        margin: 8px 0;
      }
    }
  `]
})
export class MatchListComponent {
  matchService = inject(MatchService);
  teamService = inject(TeamService);

  getTeamName(teamId: string): string {
    const team = this.teamService.getTeamById(teamId);
    return team?.name || 'Time Desconhecido';
  }
}
