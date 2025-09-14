import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TeamService } from '@core/services/team.service';
import { RankingService } from '@core/services/ranking.service';
import { Team, Player } from '@shared/interfaces/team.interface';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatTableModule, RouterModule],
  template: `
    @if (team) {
      <div class="team-detail-container">
        <div class="team-header">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          
          <div class="team-info">
            @if (team.logo) {
              <img [src]="team.logo" [alt]="team.name" class="team-logo">
            }
            <div class="team-details">
              <h1>{{ team.name }}</h1>
              <p class="team-subtitle">{{ team.city }} • Fundado em {{ team.foundedYear }}</p>
              <p class="team-stadium">{{ team.stadium }}</p>
            </div>
          </div>
          
          <div class="team-actions">
            <button mat-raised-button color="primary" [routerLink]="['/players/create']" [queryParams]="{teamId: team.id}">
              <mat-icon>person_add</mat-icon>
              Adicionar Jogador
            </button>
          </div>
        </div>

        <div class="team-stats-cards">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon>sports_soccer</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ team.statistics.matches }}</span>
                  <span class="stat-label">Partidas</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="win-icon">emoji_events</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ team.statistics.wins }}</span>
                  <span class="stat-label">Vitórias</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="points-icon">star</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ team.statistics.points }}</span>
                  <span class="stat-label">Pontos</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon>leaderboard</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ getTeamPosition() }}º</span>
                  <span class="stat-label">Posição</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-tab-group class="team-tabs">
          <mat-tab label="Elenco">
            <mat-card class="players-card">
              <mat-card-header>
                <mat-card-title>Jogadores do Elenco</mat-card-title>
                <mat-card-subtitle>{{ players.length }} jogadores cadastrados</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                @if (players.length === 0) {
                  <div class="empty-state">
                    <mat-icon class="empty-icon">person</mat-icon>
                    <h3>Nenhum jogador cadastrado</h3>
                    <p>Adicione jogadores ao elenco para começar</p>
                    <button mat-raised-button color="primary" [routerLink]="['/players/create']" [queryParams]="{teamId: team.id}">
                      Adicionar Primeiro Jogador
                    </button>
                  </div>
                } @else {
                  <div class="players-grid">
                    @for (player of players; track player.id) {
                      <div class="player-card">
                        <div class="player-header">
                          <span class="player-number">{{ player.number }}</span>
                          <div class="player-info">
                            <strong class="player-name">{{ player.name }}</strong>
                            <span class="player-position">{{ player.position }}</span>
                          </div>
                        </div>
                        <div class="player-stats">
                          <div class="stat">
                            <span class="label">Gols:</span>
                            <span class="value">{{ player.statistics.goals }}</span>
                          </div>
                          <div class="stat">
                            <span class="label">Assist:</span>
                            <span class="value">{{ player.statistics.assists }}</span>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                }
              </mat-card-content>
            </mat-card>
          </mat-tab>

          <mat-tab label="Estatísticas">
            <mat-card class="statistics-card">
              <mat-card-header>
                <mat-card-title>Estatísticas Detalhadas</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <div class="stats-grid">
                  <div class="stat-group">
                    <h3>Desempenho Geral</h3>
                    <div class="stat-row">
                      <span>Partidas Jogadas:</span>
                      <strong>{{ team.statistics.matches }}</strong>
                    </div>
                    <div class="stat-row">
                      <span>Vitórias:</span>
                      <strong class="win">{{ team.statistics.wins }}</strong>
                    </div>
                    <div class="stat-row">
                      <span>Empates:</span>
                      <strong class="draw">{{ team.statistics.draws }}</strong>
                    </div>
                    <div class="stat-row">
                      <span>Derrotas:</span>
                      <strong class="loss">{{ team.statistics.losses }}</strong>
                    </div>
                  </div>

                  <div class="stat-group">
                    <h3>Desempenho Ofensivo</h3>
                    <div class="stat-row">
                      <span>Gols Marcados:</span>
                      <strong>{{ team.statistics.goalsFor }}</strong>
                    </div>
                    <div class="stat-row">
                      <span>Média de Gols:</span>
                      <strong>{{ getGoalsAverage() }}</strong>
                    </div>
                    <div class="stat-row">
                      <span>Artilheiro:</span>
                      <strong>{{ getTopScorer() }}</strong>
                    </div>
                  </div>

                  <div class="stat-group">
                    <h3>Desempenho Defensivo</h3>
                    <div class="stat-row">
                      <span>Gols Sofridos:</span>
                      <strong>{{ team.statistics.goalsAgainst }}</strong>
                    </div>
                    <div class="stat-row">
                      <span>Saldo de Gols:</span>
                      <strong [class]="getGoalDifferenceClass()">{{ team.statistics.goalDifference }}</strong>
                    </div>
                    <div class="stat-row">
                      <span>Média Defensiva:</span>
                      <strong>{{ getDefensiveAverage() }}</strong>
                    </div>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>
          </mat-tab>
        </mat-tab-group>
      </div>
    } @else {
      <div class="loading">
        <mat-icon>hourglass_empty</mat-icon>
        <p>Carregando informações do time...</p>
      </div>
    }
  `,
  styles: [`
    .team-detail-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .team-header {
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      gap: 16px;
    }

    .back-button {
      flex-shrink: 0;
    }

    .team-info {
      display: flex;
      align-items: center;
      flex: 1;
      gap: 16px;
    }

    .team-logo {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      object-fit: cover;
    }

    .team-details h1 {
      margin: 0;
      color: #333;
      font-size: 2rem;
    }

    .team-subtitle {
      color: #666;
      margin: 4px 0;
    }

    .team-stadium {
      color: #999;
      margin: 0;
      font-size: 0.9rem;
    }

    .team-actions {
      flex-shrink: 0;
    }

    .team-stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-item {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .stat-item mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .win-icon { color: #4caf50; }
    .points-icon { color: #ff9800; }

    .stat-content {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: #1976d2;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }

    .team-tabs {
      margin-bottom: 32px;
    }

    .players-card, .statistics-card {
      margin-top: 16px;
    }

    .empty-state {
      text-align: center;
      padding: 64px 32px;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .players-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 16px;
    }

    .player-card {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 16px;
      transition: box-shadow 0.2s;
    }

    .player-card:hover {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .player-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .player-number {
      background-color: #1976d2;
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 12px;
    }

    .player-info {
      display: flex;
      flex-direction: column;
    }

    .player-name {
      font-size: 1rem;
      margin-bottom: 4px;
    }

    .player-position {
      font-size: 0.9rem;
      color: #666;
    }

    .player-stats {
      display: flex;
      gap: 16px;
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }

    .stat .label {
      font-size: 0.8rem;
      color: #999;
      margin-bottom: 2px;
    }

    .stat .value {
      font-weight: bold;
      color: #1976d2;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 32px;
    }

    .stat-group h3 {
      margin: 0 0 16px 0;
      color: #333;
      border-bottom: 2px solid #1976d2;
      padding-bottom: 8px;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      padding: 4px 0;
    }

    .stat-row:last-child {
      margin-bottom: 0;
    }

    .win { color: #4caf50; }
    .draw { color: #ff9800; }
    .loss { color: #f44336; }

    .positive { color: #4caf50; }
    .negative { color: #f44336; }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      color: #666;
    }

    .loading mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .team-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .team-info {
        flex-direction: column;
        align-items: flex-start;
      }

      .team-stats-cards {
        grid-template-columns: repeat(2, 1fr);
      }

      .players-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private teamService = inject(TeamService);
  private rankingService = inject(RankingService);

  team: Team | null = null;
  players: Player[] = [];

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.loadTeamData(teamId);
    }
  }

  private loadTeamData(teamId: string): void {
    this.team = this.teamService.getTeamById(teamId) || null;
    if (this.team) {
      this.players = this.teamService.getPlayersByTeam(teamId);
    }
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }

  getTeamPosition(): number {
    if (!this.team) return 0;
    return this.rankingService.getTeamPosition(this.team.id);
  }

  getGoalsAverage(): string {
    if (!this.team || this.team.statistics.matches === 0) return '0.0';
    return (this.team.statistics.goalsFor / this.team.statistics.matches).toFixed(1);
  }

  getDefensiveAverage(): string {
    if (!this.team || this.team.statistics.matches === 0) return '0.0';
    return (this.team.statistics.goalsAgainst / this.team.statistics.matches).toFixed(1);
  }

  getTopScorer(): string {
    if (this.players.length === 0) return 'Nenhum';
    const topScorer = this.players.reduce((top, current) => 
      current.statistics.goals > top.statistics.goals ? current : top
    );
    return topScorer.statistics.goals > 0 ? topScorer.name : 'Nenhum';
  }

  getGoalDifferenceClass(): string {
    if (!this.team) return '';
    if (this.team.statistics.goalDifference > 0) return 'positive';
    if (this.team.statistics.goalDifference < 0) return 'negative';
    return '';
  }
}
