import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { TeamService } from '@core/services/team.service';
import { Player } from '@shared/interfaces/team.interface';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, RouterModule],
  template: `
    <div class="player-list-container">
      <div class="header">
        <h1>Jogadores Cadastrados</h1>
        <button mat-raised-button color="primary" routerLink="/players/create">
          <mat-icon>person_add</mat-icon>
          Novo Jogador
        </button>
      </div>

      @if (teamService.players().length === 0) {
        <mat-card class="empty-state">
          <mat-card-content>
            <mat-icon class="empty-icon">person</mat-icon>
            <h2>Nenhum jogador cadastrado</h2>
            <p>Comece adicionando jogadores aos seus times!</p>
            <button mat-raised-button color="primary" routerLink="/players/create">
              Cadastrar Primeiro Jogador
            </button>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="players-grid">
          @for (player of teamService.players(); track player.id) {
            <mat-card class="player-card">
              <mat-card-header>
                <mat-card-title>{{ player.name }}</mat-card-title>
                <mat-card-subtitle>{{ getTeamName(player.teamId) }}</mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <div class="player-info">
                  <div class="info-row">
                    <mat-icon>tag</mat-icon>
                    <span>Número {{ player.number }}</span>
                  </div>
                  <div class="info-row">
                    <mat-icon>calendar_today</mat-icon>
                    <span>{{ player.age }} anos</span>
                  </div>
                  <div class="info-row">
                    <mat-icon>sports</mat-icon>
                    <span>{{ player.position }}</span>
                  </div>
                </div>

                <div class="player-stats">
                  <div class="stat-chip">
                    <mat-chip color="primary">
                      <mat-icon>sports_soccer</mat-icon>
                      {{ player.statistics.goals }} gols
                    </mat-chip>
                  </div>
                  <div class="stat-chip">
                    <mat-chip color="accent">
                      <mat-icon>assist</mat-icon>
                      {{ player.statistics.assists }} assistências
                    </mat-chip>
                  </div>
                  <div class="stat-chip">
                    <mat-chip>
                      <mat-icon>timer</mat-icon>
                      {{ player.statistics.matches }} jogos
                    </mat-chip>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button color="primary">
                  Ver Detalhes
                </button>
                <button mat-button [routerLink]="['/reports/player', player.id]">
                  Relatório
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .player-list-container {
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

    .empty-state h2 {
      color: #666;
      margin: 16px 0 8px 0;
    }

    .empty-state p {
      color: #999;
      margin-bottom: 24px;
    }

    .players-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .player-card {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .player-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .player-info {
      margin: 16px 0;
    }

    .info-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      color: #666;
    }

    .info-row mat-icon {
      margin-right: 8px;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .player-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 16px;
    }

    .stat-chip mat-chip {
      font-size: 12px;
    }

    .stat-chip mat-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .players-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PlayerListComponent {
  teamService = inject(TeamService);

  getTeamName(teamId: string): string {
    const team = this.teamService.getTeamById(teamId);
    return team?.name || 'Time Desconhecido';
  }
}
