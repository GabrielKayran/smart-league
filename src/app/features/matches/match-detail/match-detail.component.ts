import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatchService } from '@core/services/match.service';
import { TeamService } from '@core/services/team.service';
import { Match } from '@shared/interfaces/match.interface';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, DatePipe],
  template: `
    @if (match) {
      <div class="match-detail-container">
        <div class="match-header">
          <button mat-icon-button (click)="goBack()" class="back-button">
            <mat-icon>arrow_back</mat-icon>
          </button>
          
          <div class="match-info">
            <h1>Detalhes da Partida</h1>
            <mat-chip [class]="getStatusChipClass()">
              {{ match.status }}
            </mat-chip>
          </div>
        </div>

        <mat-card class="match-card">
          <mat-card-content>
            <div class="match-teams">
              <div class="team home">
                <h2>{{ getTeamName(match.homeTeam) }}</h2>
                <div class="team-label">Casa</div>
                @if (match.status !== 'Agendada') {
                  <div class="score">{{ match.homeScore }}</div>
                }
              </div>
              
              <div class="vs-section">
                <div class="vs">VS</div>
                <div class="match-info-details">
                  <div class="date">{{ match.date | date:'dd/MM/yyyy' }}</div>
                  <div class="time">{{ match.date | date:'HH:mm' }}</div>
                </div>
              </div>
              
              <div class="team away">
                <h2>{{ getTeamName(match.awayTeam) }}</h2>
                <div class="team-label">Visitante</div>
                @if (match.status !== 'Agendada') {
                  <div class="score">{{ match.awayScore }}</div>
                }
              </div>
            </div>

            <div class="match-venue">
              <mat-icon>stadium</mat-icon>
              <span>{{ match.stadium }}</span>
            </div>
          </mat-card-content>
        </mat-card>

        @if (match.events && match.events.length > 0) {
          <mat-card class="events-card">
            <mat-card-header>
              <mat-card-title>Eventos da Partida</mat-card-title>
              <mat-card-subtitle>{{ match.events.length }} evento(s) registrado(s)</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <div class="events-timeline">
                @for (event of match.events; track event.id) {
                  <div class="event-item">
                    <div class="event-minute">{{ event.minute }}'</div>
                    <div class="event-icon">
                      <mat-icon [class]="getEventIconClass(event.type)">
                        {{ getEventIcon(event.type) }}
                      </mat-icon>
                    </div>
                    <div class="event-details">
                      <div class="event-type">{{ event.type }}</div>
                      <div class="event-player">{{ event.playerName }}</div>
                      <div class="event-team">{{ getTeamName(event.teamId) }}</div>
                    </div>
                  </div>
                }
              </div>
            </mat-card-content>
          </mat-card>
        } @else {
          <mat-card class="no-events-card">
            <mat-card-content>
              <div class="empty-state">
                <mat-icon class="empty-icon">event_note</mat-icon>
                <h3>Nenhum evento registrado</h3>
                <p>Os eventos da partida aparecerão aqui conforme forem acontecendo</p>
              </div>
            </mat-card-content>
          </mat-card>
        }

        <div class="action-buttons">
          @if (match.status === 'Agendada') {
            <button mat-raised-button color="primary" (click)="startMatch()">
              <mat-icon>play_circle</mat-icon>
              Iniciar Partida
            </button>
          }
          
          @if (match.status === 'Ao Vivo') {
            <button mat-raised-button color="accent" (click)="simulateEvent()">
              <mat-icon>add_circle</mat-icon>
              Simular Evento
            </button>
            <button mat-raised-button color="warn" (click)="finishMatch()">
              <mat-icon>stop_circle</mat-icon>
              Finalizar Partida
            </button>
          }
        </div>
      </div>
    } @else {
      <div class="loading">
        <mat-icon>hourglass_empty</mat-icon>
        <p>Carregando informações da partida...</p>
      </div>
    }
  `,
  styles: [`
    .match-detail-container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .match-header {
      display: flex;
      align-items: center;
      margin-bottom: 32px;
      gap: 16px;
    }

    .match-info {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 1;
    }

    .match-info h1 {
      margin: 0;
      color: #333;
    }

    .status-scheduled { background-color: #ff9800; color: white; }
    .status-live { background-color: #4caf50; color: white; }
    .status-finished { background-color: #666; color: white; }

    .match-card {
      margin-bottom: 24px;
    }

    .match-teams {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .team {
      flex: 1;
      text-align: center;
    }

    .team h2 {
      margin: 0 0 8px 0;
      font-size: 1.5rem;
      color: #333;
    }

    .team-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .score {
      font-size: 3rem;
      font-weight: bold;
      color: #1976d2;
    }

    .vs-section {
      flex: 0 0 auto;
      text-align: center;
      margin: 0 32px;
    }

    .vs {
      font-size: 2rem;
      font-weight: bold;
      color: #666;
      margin-bottom: 8px;
    }

    .match-info-details {
      font-size: 14px;
      color: #666;
    }

    .date {
      margin-bottom: 4px;
    }

    .match-venue {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 8px;
      color: #666;
    }

    .events-card, .no-events-card {
      margin-bottom: 24px;
    }

    .events-timeline {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .event-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      border: 1px solid #eee;
      border-radius: 8px;
      transition: background-color 0.2s;
    }

    .event-item:hover {
      background-color: #f9f9f9;
    }

    .event-minute {
      font-weight: bold;
      color: #1976d2;
      min-width: 40px;
    }

    .event-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: #f5f5f5;
    }

    .icon-goal { color: #4caf50; }
    .icon-yellow { color: #ff9800; }
    .icon-red { color: #f44336; }
    .icon-substitution { color: #2196f3; }

    .event-details {
      flex: 1;
    }

    .event-type {
      font-weight: 500;
      margin-bottom: 4px;
    }

    .event-player {
      color: #333;
      margin-bottom: 2px;
    }

    .event-team {
      font-size: 12px;
      color: #666;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }

    .action-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .action-buttons button {
      min-width: 150px;
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
      .match-teams {
        flex-direction: column;
        gap: 24px;
      }

      .vs-section {
        margin: 0;
      }

      .score {
        font-size: 2rem;
      }

      .action-buttons {
        flex-direction: column;
        align-items: stretch;
      }

      .action-buttons button {
        width: 100%;
      }
    }
  `]
})
export class MatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private matchService = inject(MatchService);
  private teamService = inject(TeamService);

  match: Match | null = null;

  ngOnInit(): void {
    const matchId = this.route.snapshot.paramMap.get('id');
    if (matchId) {
      this.loadMatchData(matchId);
    }
  }

  private loadMatchData(matchId: string): void {
    this.match = this.matchService.getMatchById(matchId) || null;
  }

  goBack(): void {
    this.router.navigate(['/matches']);
  }

  getTeamName(teamId: string): string {
    const team = this.teamService.getTeamById(teamId);
    return team?.name || 'Time Desconhecido';
  }

  getStatusChipClass(): string {
    if (!this.match) return '';
    switch (this.match.status) {
      case 'Agendada': return 'status-scheduled';
      case 'Ao Vivo': return 'status-live';
      case 'Finalizada': return 'status-finished';
      default: return '';
    }
  }

  getEventIcon(eventType: string): string {
    switch (eventType) {
      case 'Gol': return 'sports_soccer';
      case 'Cartão Amarelo': return 'crop_portrait';
      case 'Cartão Vermelho': return 'crop_portrait';
      case 'Substituição': return 'swap_horiz';
      default: return 'event';
    }
  }

  getEventIconClass(eventType: string): string {
    switch (eventType) {
      case 'Gol': return 'icon-goal';
      case 'Cartão Amarelo': return 'icon-yellow';
      case 'Cartão Vermelho': return 'icon-red';
      case 'Substituição': return 'icon-substitution';
      default: return '';
    }
  }

  startMatch(): void {
    if (this.match) {
      this.matchService.updateMatchStatus(this.match.id, 'Ao Vivo' as any);
      this.loadMatchData(this.match.id);
    }
  }

  finishMatch(): void {
    if (this.match) {
      this.matchService.updateMatchStatus(this.match.id, 'Finalizada' as any);
      this.loadMatchData(this.match.id);
    }
  }

  simulateEvent(): void {
    if (this.match) {
      this.matchService.simulateMatchProgress(this.match.id);
      this.loadMatchData(this.match.id);
    }
  }
}
