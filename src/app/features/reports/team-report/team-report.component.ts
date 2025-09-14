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
  templateUrl: './team-report.component.html',
  styleUrl: './team-report.component.scss'
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
