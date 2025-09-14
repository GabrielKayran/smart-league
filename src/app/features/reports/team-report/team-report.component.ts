import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReportService, TeamReport } from '@core/services/report.service';

@Component({
  selector: 'app-team-report',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  template: `
    @if (teamReport) {
      <div class="team-report-container">
        <div class="header">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          <h1>Relatório do Time</h1>
        </div>

        <mat-card class="team-info-card">
          <mat-card-content>
            <div class="team-header">
              <div class="team-details">
                <h2>{{ teamReport.team.name }}</h2>
                <p>{{ teamReport.team.city }} • Fundado em {{ teamReport.team.foundedYear }}</p>
                <p>{{ teamReport.team.stadium }}</p>
              </div>
              <div class="position-badge">
                <div class="position-circle">
                  <span class="position-value">{{ teamReport.currentPosition }}º</span>
                </div>
                <span class="position-label">Posição na Liga</span>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon points">star</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ teamReport.team.statistics.points }}</span>
                  <span class="stat-label">Pontos</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon goals">sports_soccer</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ teamReport.goalScoringAverage.toFixed(1) }}</span>
                  <span class="stat-label">Média de Gols</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon defense">shield</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ teamReport.defensiveAverage.toFixed(1) }}</span>
                  <span class="stat-label">Média Defensiva</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-content>
              <div class="stat-item">
                <mat-icon class="stat-icon wins">emoji_events</mat-icon>
                <div class="stat-content">
                  <span class="stat-value">{{ teamReport.team.statistics.wins }}</span>
                  <span class="stat-label">Vitórias</span>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="detailed-sections">
          <mat-card class="performance-card">
            <mat-card-header>
              <mat-card-title>Desempenho Geral</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="performance-stats">
                <div class="stat-group">
                  <h3>Geral</h3>
                  <div class="stat-row">
                    <span>Partidas:</span>
                    <strong>{{ teamReport.team.statistics.matches }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Vitórias:</span>
                    <strong class="win">{{ teamReport.team.statistics.wins }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Empates:</span>
                    <strong class="draw">{{ teamReport.team.statistics.draws }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Derrotas:</span>
                    <strong class="loss">{{ teamReport.team.statistics.losses }}</strong>
                  </div>
                </div>

                <div class="stat-group">
                  <h3>Casa</h3>
                  <div class="stat-row">
                    <span>Vitórias:</span>
                    <strong class="win">{{ teamReport.homeRecord.wins }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Empates:</span>
                    <strong class="draw">{{ teamReport.homeRecord.draws }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Derrotas:</span>
                    <strong class="loss">{{ teamReport.homeRecord.losses }}</strong>
                  </div>
                </div>

                <div class="stat-group">
                  <h3>Visitante</h3>
                  <div class="stat-row">
                    <span>Vitórias:</span>
                    <strong class="win">{{ teamReport.awayRecord.wins }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Empates:</span>
                    <strong class="draw">{{ teamReport.awayRecord.draws }}</strong>
                  </div>
                  <div class="stat-row">
                    <span>Derrotas:</span>
                    <strong class="loss">{{ teamReport.awayRecord.losses }}</strong>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="top-player-card">
            <mat-card-header>
              <mat-card-title>Artilheiro do Time</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (teamReport.topScorer) {
                <div class="top-scorer">
                  <div class="player-info">
                    <h3>{{ teamReport.topScorer.name }}</h3>
                    <p>{{ teamReport.topScorer.position }} • Nº {{ teamReport.topScorer.number }}</p>
                  </div>
                  <div class="scorer-stats">
                    <span class="goals">{{ teamReport.topScorer.statistics.goals }}</span>
                    <span class="label">gols</span>
                  </div>
                </div>
              } @else {
                <p class="no-data">Nenhum gol marcado ainda</p>
              }
            </mat-card-content>
          </mat-card>

          <mat-card class="form-card">
            <mat-card-header>
              <mat-card-title>Últimos Resultados</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @if (teamReport.recentForm.length > 0) {
                <div class="form-display">
                  @for (result of teamReport.recentForm; track $index) {
                    <div class="form-result" [class]="getFormClass(result)">
                      {{ result }}
                    </div>
                  }
                </div>
                <div class="form-legend">
                  <span><strong>V</strong> - Vitória</span>
                  <span><strong>E</strong> - Empate</span>
                  <span><strong>D</strong> - Derrota</span>
                </div>
              } @else {
                <p class="no-data">Nenhuma partida disputada ainda</p>
              }
            </mat-card-content>
          </mat-card>
        </div>

        <div class="action-buttons">
          <button mat-raised-button color="primary" (click)="exportReport()">
            <mat-icon>file_download</mat-icon>
            Exportar CSV
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
        <p>Carregando relatório do time...</p>
      </div>
    }
  `,
  styles: [`
    .team-report-container {
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

    .team-info-card {
      margin-bottom: 24px;
    }

    .team-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .team-details h2 {
      margin: 0 0 8px 0;
      color: #333;
    }

    .team-details p {
      margin: 4px 0;
      color: #666;
    }

    .position-badge {
      text-align: center;
    }

    .position-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #1976d2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    }

    .position-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: white;
    }

    .position-label {
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

    .stat-icon.points { color: #ff9800; }
    .stat-icon.goals { color: #4caf50; }
    .stat-icon.defense { color: #2196f3; }
    .stat-icon.wins { color: #ffc107; }

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
    }

    .detailed-sections {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    .performance-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
    }

    .stat-group h3 {
      margin: 0 0 12px 0;
      color: #333;
      border-bottom: 2px solid #1976d2;
      padding-bottom: 4px;
      font-size: 1rem;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      padding: 2px 0;
      font-size: 14px;
    }

    .win { color: #4caf50; }
    .draw { color: #ff9800; }
    .loss { color: #f44336; }

    .top-scorer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .player-info h3 {
      margin: 0 0 4px 0;
      color: #333;
    }

    .player-info p {
      margin: 0;
      color: #666;
      font-size: 14px;
    }

    .scorer-stats {
      text-align: center;
    }

    .goals {
      display: block;
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
    }

    .label {
      font-size: 12px;
      color: #666;
    }

    .form-display {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 16px;
    }

    .form-result {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
    }

    .form-result.win { background-color: #4caf50; }
    .form-result.draw { background-color: #ff9800; }
    .form-result.loss { background-color: #f44336; }

    .form-legend {
      display: flex;
      justify-content: space-around;
      font-size: 12px;
      color: #666;
    }

    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      margin: 0;
    }

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
      .team-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .detailed-sections {
        grid-template-columns: 1fr;
      }

      .performance-stats {
        grid-template-columns: 1fr;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class TeamReportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private reportService = inject(ReportService);

  teamReport: TeamReport | null = null;

  ngOnInit(): void {
    const teamId = this.route.snapshot.paramMap.get('id');
    if (teamId) {
      this.teamReport = this.reportService.generateTeamReport(teamId);
    }
  }

  goBack(): void {
    this.router.navigate(['/reports']);
  }

  exportReport(): void {
    if (this.teamReport) {
      this.reportService.exportTeamReportCSV(this.teamReport.team.id);
    }
  }

  getFormClass(result: string): string {
    switch (result) {
      case 'V': return 'win';
      case 'E': return 'draw';
      case 'D': return 'loss';
      default: return '';
    }
  }
}
