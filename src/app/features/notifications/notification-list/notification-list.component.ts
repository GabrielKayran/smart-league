import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { DatePipe } from '@angular/common';
import { NotificationType } from '@shared/interfaces/notification.interface';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule, MatChipsModule, DatePipe, RouterModule],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent {
  notificationService = inject(NotificationService);

  getNotificationIcon(type: NotificationType): string {
    switch (type) {
      case NotificationType.INFO:
        return 'info';
      case NotificationType.WARNING:
        return 'warning';
      case NotificationType.SUCCESS:
        return 'check_circle';
      case NotificationType.ERROR:
        return 'error';
      default:
        return 'notifications';
    }
  }

  getNotificationIconClass(type: NotificationType): string {
    switch (type) {
      case NotificationType.INFO:
        return 'icon-info';
      case NotificationType.WARNING:
        return 'icon-warning';
      case NotificationType.SUCCESS:
        return 'icon-success';
      case NotificationType.ERROR:
        return 'icon-error';
      default:
        return 'icon-info';
    }
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(notificationId: string): void {
    this.notificationService.deleteNotification(notificationId);
  }
}