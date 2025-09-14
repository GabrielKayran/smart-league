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
  templateUrl: './player-report.component.html',
  styleUrl: './player-report.component.scss'
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
