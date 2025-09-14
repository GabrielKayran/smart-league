import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ReportService } from '@core/services/report.service';
import { TeamService } from '@core/services/team.service';

@Component({
  selector: 'app-report-dashboard',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, RouterModule],
  template: `
    <div class="report-dashboard-container">
      <div class="header">
        <h1>Central de Relatórios</h1>
        <p>Análises e estatísticas detalhadas da liga</p>
      </div>

      <div class="report-sections">
        <mat-card class="section-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="icon-league">assessment</mat-icon>
            <mat-card-title>Relatório da Liga</mat-card-title>
            <mat-card-subtitle>Estatísticas gerais do campeonato</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="quick-stats">
              <div class="stat">
                <span class="value">{{ reportService.leagueReport().totalMatches }}</span>
                <span class="label">Total de Partidas</span>
              </div>
              <div class="stat">
                <span class="value">{{ reportService.leagueReport().totalGoals }}</span>
                <span class="label">Total de Gols</span>
              </div>
              <div class="stat">
                <span class="value">{{ reportService.leagueReport().averageGoalsPerMatch.toFixed(1) }}</span>
                <span class="label">Média de Gols/Partida</span>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary">
              Ver Relatório Completo
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="section-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="icon-team">groups</mat-icon>
            <mat-card-title>Relatórios por Time</mat-card-title>
            <mat-card-subtitle>Análises detalhadas de cada equipe</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="teams-list">
              @for (team of teamService.teams(); track team.id) {
                <div class="team-item">
                  <span class="team-name">{{ team.name }}</span>
                  <button mat-button color="primary" [routerLink]="['/reports/team', team.id]">
                    <mat-icon>description</mat-icon>
                    Ver Relatório
                  </button>
                </div>
              }
            </div>
            @if (teamService.teams().length === 0) {
              <p class="no-data">Nenhum time cadastrado ainda</p>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="section-card">
          <mat-card-header>
            <mat-icon mat-card-avatar class="icon-player">person</mat-icon>
            <mat-card-title>Relatórios por Jogador</mat-card-title>
            <mat-card-subtitle>Estatísticas individuais dos atletas</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="players-list">
              @for (player of teamService.players(); track player.id) {
                <div class="player-item">
                  <div class="player-info">
                    <span class="player-name">{{ player.name }}</span>
                    <span class="player-team">{{ getTeamName(player.teamId) }}</span>
                  </div>
                  <button mat-button color="primary" [routerLink]="['/reports/player', player.id]">
                    <mat-icon>description</mat-icon>
                    Ver Relatório
                  </button>
                </div>
              }
            </div>
            @if (teamService.players().length === 0) {
              <p class="no-data">Nenhum jogador cadastrado ainda</p>
            }
          </mat-card-content>
        </mat-card>

        <mat-card class="section-card highlights">
          <mat-card-header>
            <mat-icon mat-card-avatar class="icon-highlight">star</mat-icon>
            <mat-card-title>Destaques da Liga</mat-card-title>
            <mat-card-subtitle>Principais performances</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="highlights-grid">
              @if (reportService.leagueReport().mostWins) {
                <div class="highlight-item">
                  <mat-icon class="highlight-icon">emoji_events</mat-icon>
                  <div class="highlight-content">
                    <span class="highlight-title">Mais Vitórias</span>
                    <span class="highlight-value">{{ reportService.leagueReport().mostWins!.name }}</span>
                    <span class="highlight-detail">{{ reportService.leagueReport().mostWins!.statistics.wins }} vitórias</span>
                  </div>
                </div>
              }

              @if (reportService.leagueReport().bestAttack) {
                <div class="highlight-item">
                  <mat-icon class="highlight-icon">sports_soccer</mat-icon>
                  <div class="highlight-content">
                    <span class="highlight-title">Melhor Ataque</span>
                    <span class="highlight-value">{{ reportService.leagueReport().bestAttack!.name }}</span>
                    <span class="highlight-detail">{{ reportService.leagueReport().bestAttack!.statistics.goalsFor }} gols</span>
                  </div>
                </div>
              }

              @if (reportService.leagueReport().bestDefense) {
                <div class="highlight-item">
                  <mat-icon class="highlight-icon">shield</mat-icon>
                  <div class="highlight-content">
                    <span class="highlight-title">Melhor Defesa</span>
                    <span class="highlight-value">{{ reportService.leagueReport().bestDefense!.name }}</span>
                    <span class="highlight-detail">{{ reportService.leagueReport().bestDefense!.statistics.goalsAgainst }} gols sofridos</span>
                  </div>
                </div>
              }
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .report-dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 32px;
    }

    .header h1 {
      margin: 0;
      color: #333;
      font-size: 2.5rem;
    }

    .header p {
      color: #666;
      margin: 8px 0 0 0;
      font-size: 1.1rem;
    }

    .report-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .section-card {
      height: fit-content;
    }

    .section-card.highlights {
      grid-column: 1 / -1;
    }

    .icon-league { background-color: #e3f2fd; color: #1976d2; }
    .icon-team { background-color: #e8f5e8; color: #388e3c; }
    .icon-player { background-color: #fff3e0; color: #f57c00; }
    .icon-highlight { background-color: #fce4ec; color: #c2185b; }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin: 16px 0;
    }

    .stat {
      text-align: center;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .stat .value {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin-bottom: 4px;
    }

    .stat .label {
      font-size: 12px;
      color: #666;
    }

    .teams-list, .players-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 300px;
      overflow-y: auto;
    }

    .team-item, .player-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      border: 1px solid #eee;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .team-item:hover, .player-item:hover {
      background-color: #f5f5f5;
    }

    .team-name, .player-name {
      font-weight: 500;
    }

    .player-info {
      display: flex;
      flex-direction: column;
    }

    .player-team {
      font-size: 12px;
      color: #666;
    }

    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 20px;
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
    }

    .highlight-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background-color: #f9f9f9;
      border-radius: 8px;
    }

    .highlight-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #1976d2;
    }

    .highlight-content {
      display: flex;
      flex-direction: column;
    }

    .highlight-title {
      font-size: 12px;
      color: #666;
      margin-bottom: 2px;
    }

    .highlight-value {
      font-weight: bold;
      color: #333;
      margin-bottom: 2px;
    }

    .highlight-detail {
      font-size: 12px;
      color: #999;
    }

    @media (max-width: 768px) {
      .report-sections {
        grid-template-columns: 1fr;
      }

      .quick-stats {
        grid-template-columns: 1fr;
      }

      .highlights-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReportDashboardComponent {
  reportService = inject(ReportService);
  teamService = inject(TeamService);

  getTeamName(teamId: string): string {
    const team = this.teamService.getTeamById(teamId);
    return team?.name || 'Time Desconhecido';
  }
}
