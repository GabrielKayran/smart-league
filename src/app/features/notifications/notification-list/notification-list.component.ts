import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { NotificationService } from '@core/services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule, MatChipsModule, DatePipe],
  template: `
    <div class="notification-container">
      <div class="header">
        <h1>Central de Notificações</h1>
        <div class="header-actions">
          <mat-chip [matBadge]="notificationService.unreadCount()" matBadgeColor="warn">
            {{ notificationService.unreadCount() }} não lidas
          </mat-chip>
          <button mat-raised-button color="primary" (click)="markAllAsRead()" [disabled]="notificationService.unreadCount() === 0">
            Marcar Todas como Lidas
          </button>
        </div>
      </div>

      @if (notificationService.notifications().length === 0) {
        <mat-card class="empty-state">
          <mat-card-content>
            <mat-icon class="empty-icon">notifications</mat-icon>
            <h2>Nenhuma notificação</h2>
            <p>Você está em dia com todas as informações!</p>
          </mat-card-content>
        </mat-card>
      } @else {
        <div class="notifications-list">
          @for (notification of notificationService.notifications(); track notification.id) {
            <mat-card class="notification-card" [class.unread]="!notification.isRead">
              <mat-card-header>
                <mat-icon mat-card-avatar [class]="getNotificationIconClass(notification.type)">
                  {{ getNotificationIcon(notification.type) }}
                </mat-icon>
                <mat-card-title>{{ notification.title }}</mat-card-title>
                <mat-card-subtitle>
                  {{ notification.createdAt | date:'dd/MM/yyyy HH:mm' }}
                  @if (!notification.isRead) {
                    <mat-chip class="unread-chip">Nova</mat-chip>
                  }
                </mat-card-subtitle>
              </mat-card-header>
              
              <mat-card-content>
                <p>{{ notification.message }}</p>
                <mat-chip [class]="getTypeChipClass(notification.type)">
                  {{ notification.type }}
                </mat-chip>
              </mat-card-content>

              <mat-card-actions align="end">
                @if (!notification.isRead) {
                  <button mat-button color="primary" (click)="markAsRead(notification.id)">
                    Marcar como Lida
                  </button>
                }
                <button mat-button color="warn" (click)="deleteNotification(notification.id)">
                  Excluir
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      max-width: 800px;
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

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
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

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .notification-card {
      transition: all 0.2s ease;
    }

    .notification-card.unread {
      border-left: 4px solid #1976d2;
      background-color: #f8f9ff;
    }

    .notification-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .unread-chip {
      background-color: #1976d2 !important;
      color: white !important;
      font-size: 10px;
      height: 18px;
      margin-left: 8px;
    }

    .icon-info { color: #2196f3; }
    .icon-success { color: #4caf50; }
    .icon-warning { color: #ff9800; }
    .icon-error { color: #f44336; }
    .icon-match { color: #9c27b0; }
    .icon-team { color: #607d8b; }

    .chip-info { background-color: #e3f2fd; color: #1976d2; }
    .chip-success { background-color: #e8f5e8; color: #2e7d32; }
    .chip-warning { background-color: #fff3e0; color: #ef6c00; }
    .chip-error { background-color: #ffebee; color: #c62828; }
    .chip-match { background-color: #f3e5f5; color: #7b1fa2; }
    .chip-team { background-color: #eceff1; color: #455a64; }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
      }

      .header-actions {
        justify-content: space-between;
      }
    }
  `]
})
export class NotificationListComponent {
  notificationService = inject(NotificationService);

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id);
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'Informação': return 'info';
      case 'Sucesso': return 'check_circle';
      case 'Aviso': return 'warning';
      case 'Erro': return 'error';
      case 'Atualização de Partida': return 'sports_soccer';
      case 'Notícias do Time': return 'group';
      default: return 'notifications';
    }
  }

  getNotificationIconClass(type: string): string {
    switch (type) {
      case 'Informação': return 'icon-info';
      case 'Sucesso': return 'icon-success';
      case 'Aviso': return 'icon-warning';
      case 'Erro': return 'icon-error';
      case 'Atualização de Partida': return 'icon-match';
      case 'Notícias do Time': return 'icon-team';
      default: return 'icon-info';
    }
  }

  getTypeChipClass(type: string): string {
    switch (type) {
      case 'Informação': return 'chip-info';
      case 'Sucesso': return 'chip-success';
      case 'Aviso': return 'chip-warning';
      case 'Erro': return 'chip-error';
      case 'Atualização de Partida': return 'chip-match';
      case 'Notícias do Time': return 'chip-team';
      default: return 'chip-info';
    }
  }
}
