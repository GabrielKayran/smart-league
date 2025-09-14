import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReportService, PlayerReport } from '@core/services/report.service';

@Component({
  selector: 'app-player-report',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    @if (playerReport) {
      <div class="player-report-container">
        <div class="header">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Relatório do Jogador</h1>
        </div>

        <mat-card class="player-info-card">
          <mat-card-content>
            <div class="player-header">
              <div class="player-details">
                <h2>{{ playerReport.player.name }}</h2>
                <p>{{ playerReport.team.name }} • {{ playerReport.player.position }}</p>
                <p>Número {{ playerReport.player.number }} • {{ playerReport.player.age }} anos</p>
              </div>
              <div class="performance-rating">
                <div class="rating-circle" [style.background]="getRatingColor()">
                  <span class="rating-value">{{ playerReport.performanceRating.toFixed(1) }}</span>
                </div>
                <span class="rating-label">Avaliação</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon goals">sports_soccer</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ playerReport.player.statistics.goals }}</span>
                  <span class="stat-label">Gols</span>
                  <span class="stat-detail">{{ playerReport.averageGoalsPerMatch.toFixed(2) }} por jogo</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon assists">assistant</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ playerReport.player.statistics.assists }}</span>
                  <span class="stat-label">Assistências</span>
                  <span class="stat-detail">{{ playerReport.averageAssistsPerMatch.toFixed(2) }} por jogo</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon matches">timer</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ playerReport.player.statistics.matches }}</span>
                  <span class="stat-label">Partidas</span>
                  <span class="stat-detail">{{ playerReport.player.statistics.minutesPlayed }} min</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon discipline" [style.color]="getDisciplineColor()">credit_card</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ getTotalCards() }}</span>
                  <span class="stat-label">Cartões</span>
                  <span class="stat-detail">{{ playerReport.disciplinaryRecord }}</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="detailed-stats-card">
          <mat-card-header>
            <mat-card-title>Estatísticas Detalhadas</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="detailed-stats">
              <div class="stat-group">
                <h3>Desempenho Ofensivo</h3>
                <div class="stat-row">
                  <span>Total de Gols:</span>
                  <strong>{{ playerReport.player.statistics.goals }}</strong>
                </div>
                <div class="stat-row">
                  <span>Total de Assistências:</span>
                  <strong>{{ playerReport.player.statistics.assists }}</strong>
                </div>
                <div class="stat-row">
                  <span>Participações em Gols:</span>
                  <strong>{{ playerReport.player.statistics.goals + playerReport.player.statistics.assists }}</strong>
                </div>
                <div class="stat-row">
                  <span>Média por Partida:</span>
                  <strong>{{ getGoalContributionAverage() }}</strong>
                </div>
              </div>

              <div class="stat-group">
                <h3>Disciplina</h3>
                <div class="stat-row">
                  <span>Cartões Amarelos:</span>
                  <strong class="yellow">{{ playerReport.player.statistics.yellowCards }}</strong>
                </div>
                <div class="stat-row">
                  <span>Cartões Vermelhos:</span>
                  <strong class="red">{{ playerReport.player.statistics.redCards }}</strong>
                </div>
                <div class="stat-row">
                  <span>Registro Disciplinar:</span>
                  <strong [style.color]="getDisciplineColor()">{{ playerReport.disciplinaryRecord }}</strong>
                </div>
              </div>

              <div class="stat-group">
                <h3>Tempo de Jogo</h3>
                <div class="stat-row">
                  <span>Partidas Jogadas:</span>
                  <strong>{{ playerReport.player.statistics.matches }}</strong>
                </div>
                <div class="stat-row">
                  <span>Minutos Totais:</span>
                  <strong>{{ playerReport.player.statistics.minutesPlayed }}</strong>
                </div>
                <div class="stat-row">
                  <span>Média por Jogo:</span>
                  <strong>{{ getAverageMinutes() }} min</strong>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="exportReport()">
            <mat-icon>file_download</mat-icon>
            Exportar PDF
          </button>
          <button mat-raised-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Voltar
          </button>
        </div>
      </div>
    } @else {
      <div class="loading">
        <mat-icon>hourglass_empty</mat-icon>
        <p>Carregando relatório do jogador...</p>
      </div>
    }
  `,
  styles: [`
    .player-report-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }

    .header h1 {
      margin: 0;
      color: #333;
    }

    .player-info-card {
      margin-bottom: 24px;
    }

    .player-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .player-details h2 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .player-details p {
      margin: 4px 0;
      color: #666;
    }

    .performance-rating {
      text-align: center;
    }

    .rating-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .rating-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }

    .rating-label {
      font-size: 12px;
      color: #666;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      text-align: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .stat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
    }

    .stat-icon.goals { color: #4caf50; }
    .stat-icon.assists { color: #2196f3; }
    .stat-icon.matches { color: #ff9800; }

    .stat-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin-bottom: 4px;
    }

    .stat-label {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .stat-detail {
      font-size: 12px;
      color: #666;
    }

    .detailed-stats-card {
      margin-bottom: 24px;
    }

    .detailed-stats {
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

    .yellow { color: #ff9800; }
    .red { color: #f44336; }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
    }

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
      .player-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .detailed-stats {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class PlayerReportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportService = inject(ReportService);

  playerReport: PlayerReport | null = null;

  ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('id');
    if (playerId) {
      this.playerReport = this.reportService.generatePlayerReport(playerId);
    }
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }

  exportReport(): void {
    if (this.playerReport) {
      this.reportService.exportPlayerReportPDF(this.playerReport.player.id);
    }
  }

  getRatingColor(): string {
    if (!this.playerReport) return '#ccc';
    const rating = this.playerReport.performanceRating;
    if (rating >= 80) return '#4caf50';
    if (rating >= 60) return '#ff9800';
    if (rating >= 40) return '#ff5722';
    return '#f44336';
  }

  getDisciplineColor(): string {
    if (!this.playerReport) return '#666';
    switch (this.playerReport.disciplinaryRecord) {
      case 'Excelente': return '#4caf50';
      case 'Bom': return '#8bc34a';
      case 'Regular': return '#ff9800';
      case 'Ruim': return '#f44336';
      default: return '#666';
    }
  }

  getTotalCards(): number {
    if (!this.playerReport) return 0;
    return this.playerReport.player.statistics.yellowCards + this.playerReport.player.statistics.redCards;
  }

  getGoalContributionAverage(): string {
    if (!this.playerReport) return '0.00';
    const totalContributions = this.playerReport.player.statistics.goals + this.playerReport.player.statistics.assists;
    const matches = Math.max(1, this.playerReport.player.statistics.matches);
    return (totalContributions / matches).toFixed(2);
  }

  getAverageMinutes(): string {
    if (!this.playerReport) return '0';
    const matches = Math.max(1, this.playerReport.player.statistics.matches);
    return (this.playerReport.player.statistics.minutesPlayed / matches).toFixed(0);
  }
}
