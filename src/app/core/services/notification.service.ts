import { Injectable, signal, computed } from '@angular/core';
import { Notification, NotificationType, NotificationAudience } from '@shared/interfaces/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([]);

  notifications = this.notificationsSignal.asReadonly();

  unreadCount = computed(() => 
    this.notificationsSignal().filter(notification => !notification.isRead).length
  );

  unreadNotifications = computed(() => 
    this.notificationsSignal().filter(notification => !notification.isRead)
  );

  recentNotifications = computed(() => 
    this.notificationsSignal()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10)
  );

  constructor() {
    this.loadMockData();
  }

  createNotification(notificationData: Omit<Notification, 'id' | 'isRead' | 'createdAt'>): string {
    const newNotification: Notification = {
      ...notificationData,
      id: this.generateId(),
      isRead: false,
      createdAt: new Date()
    };

    this.notificationsSignal.update(notifications => [newNotification, ...notifications]);
    return newNotification.id;
  }

  markAsRead(id: string): boolean {
    const notificationExists = this.notificationsSignal().some(notification => notification.id === id);
    if (!notificationExists) return false;

    this.notificationsSignal.update(notifications =>
      notifications.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true, readAt: new Date() }
          : notification
      )
    );
    return true;
  }

  markAllAsRead(): void {
    this.notificationsSignal.update(notifications =>
      notifications.map(notification => ({
        ...notification,
        isRead: true,
        readAt: new Date()
      }))
    );
  }

  deleteNotification(id: string): boolean {
    const notificationExists = this.notificationsSignal().some(notification => notification.id === id);
    if (!notificationExists) return false;

    this.notificationsSignal.update(notifications =>
      notifications.filter(notification => notification.id !== id)
    );
    return true;
  }

  getNotificationsByTeam(teamId: string): Notification[] {
    return this.notificationsSignal().filter(notification =>
      notification.teamId === teamId || 
      notification.targetAudience === NotificationAudience.ALL
    );
  }

  getNotificationsByType(type: NotificationType): Notification[] {
    return this.notificationsSignal().filter(notification => notification.type === type);
  }

  sendMatchUpdateNotification(matchInfo: { homeTeam: string; awayTeam: string; score: string; }): string {
    return this.createNotification({
      title: 'Atualização de Partida',
      message: `${matchInfo.homeTeam} vs ${matchInfo.awayTeam} - ${matchInfo.score}`,
      type: NotificationType.MATCH_UPDATE,
      targetAudience: NotificationAudience.ALL
    });
  }

  sendTeamNewsNotification(teamId: string, title: string, message: string): string {
    return this.createNotification({
      title,
      message,
      type: NotificationType.TEAM_NEWS,
      targetAudience: NotificationAudience.TEAM_FANS,
      teamId
    });
  }

  private loadMockData(): void {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Partida Agendada',
        message: 'Flamengo vs Palmeiras agendada para amanhã às 16h00',
        type: NotificationType.MATCH_UPDATE,
        targetAudience: NotificationAudience.ALL,
        isRead: false,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        id: '2',
        title: 'Novo Reforço',
        message: 'Flamengo anuncia contratação de novo atacante',
        type: NotificationType.TEAM_NEWS,
        targetAudience: NotificationAudience.TEAM_FANS,
        teamId: '1',
        isRead: true,
        createdAt: new Date(Date.now() - 7200000),
        readAt: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        title: 'Resultado Final',
        message: 'Palmeiras 2 x 1 Flamengo - Partida encerrada',
        type: NotificationType.MATCH_UPDATE,
        targetAudience: NotificationAudience.ALL,
        isRead: false,
        createdAt: new Date(Date.now() - 86400000)
      }
    ];

    this.notificationsSignal.set(mockNotifications);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
