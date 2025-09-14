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
        title: 'Partida de Amanhã Confirmada!',
        message: 'Unidos do Angular FC vs Raça e Pegada no Campo do Seu Zé às 15h00. Juninho Perna Torta promete fazer a diferença!',
        type: NotificationType.MATCH_UPDATE,
        targetAudience: NotificationAudience.ALL,
        isRead: false,
        createdAt: new Date(Date.now() - 1800000)
      },
      {
        id: '2',
        title: 'Hat-trick Histórico!',
        message: 'Juninho Perna Torta marcou 3 gols na vitória por 4x2 contra os Garotos da Vila. O craque da perna torta não para!',
        type: NotificationType.MATCH_UPDATE,
        targetAudience: NotificationAudience.ALL,
        isRead: true,
        createdAt: new Date(Date.now() - 3600000),
        readAt: new Date(Date.now() - 1800000)
      },
      {
        id: '3',
        title: 'Novo Jogador no Força Jovem',
        message: 'Força Jovem contrata o goleiro "Muralha" vindo do time do bairro vizinho. Vai reforçar as defesas!',
        type: NotificationType.TEAM_NEWS,
        targetAudience: NotificationAudience.TEAM_FANS,
        teamId: '6',
        isRead: false,
        createdAt: new Date(Date.now() - 7200000)
      },
      {
        id: '4',
        title: 'Expulsão Polêmica',
        message: 'Paulinho Volante levou vermelho direto na partida contra Força Jovem. "Foi nada demais", disse o jogador.',
        type: NotificationType.INFO,
        targetAudience: NotificationAudience.ALL,
        isRead: false,
        createdAt: new Date(Date.now() - 10800000)
      },
      {
        id: '5',
        title: 'Gol de Bicicleta Viraliza',
        message: 'O gol de bicicleta do Carlinhos Bicicleta está bombando nas redes! Já tem mais de 1000 visualizações no grupo do WhatsApp.',
        type: NotificationType.INFO,
        targetAudience: NotificationAudience.ALL,
        isRead: true,
        createdAt: new Date(Date.now() - 14400000),
        readAt: new Date(Date.now() - 7200000)
      },
      {
        id: '6',
        title: 'Artilheiro da Rodada',
        message: 'Thiaguinho Artilheiro fez 2 gols no empate em 2x2 com o Só Alegria. Mantém a artilharia em dia!',
        type: NotificationType.MATCH_UPDATE,
        targetAudience: NotificationAudience.ALL,
        isRead: false,
        createdAt: new Date(Date.now() - 18000000)
      },
      {
        id: '7',
        title: 'Campo Reformado',
        message: 'Campo da Praça dos Garotos da Vila passou por reforma. Agora tem grama nova e travessões pintados!',
        type: NotificationType.INFO,
        targetAudience: NotificationAudience.ALL,
        isRead: true,
        createdAt: new Date(Date.now() - 86400000),
        readAt: new Date(Date.now() - 43200000)
      },
      {
        id: '8',
        title: 'Briga na Arquibancada',
        message: 'Torcida do Beira Rio FC e Só Alegria entraram em confusão após o jogo. Polícia foi chamada, mas já voltou a calma.',
        type: NotificationType.INFO,
        targetAudience: NotificationAudience.ALL,
        isRead: false,
        createdAt: new Date(Date.now() - 172800000)
      },
      {
        id: '9',
        title: 'Goleiro Frangão Franga Denovo',
        message: 'Goleiro Frangão do Unidos do Angular FC levou gol por baixo das pernas. Torcida pede substituição!',
        type: NotificationType.TEAM_NEWS,
        targetAudience: NotificationAudience.TEAM_FANS,
        teamId: '1',
        isRead: true,
        createdAt: new Date(Date.now() - 259200000),
        readAt: new Date(Date.now() - 172800000)
      },
      {
        id: '10',
        title: 'Churrasquinho Pós-Jogo',
        message: 'Raça e Pegada faz churrasquinho para comemorar vitória. Cerveja gelada garantida! Compareçam galera!',
        type: NotificationType.TEAM_NEWS,
        targetAudience: NotificationAudience.TEAM_FANS,
        teamId: '2',
        isRead: false,
        createdAt: new Date(Date.now() - 345600000)
      },
      {
        id: '11',
        title: 'Tabela Atualizada',
        message: 'Raça e Pegada assumiu a liderança do campeonato após vitória por 3x1. Unidos do Angular FC em segundo lugar.',
        type: NotificationType.INFO,
        targetAudience: NotificationAudience.ALL,
        isRead: true,
        createdAt: new Date(Date.now() - 432000000),
        readAt: new Date(Date.now() - 259200000)
      },
      {
        id: '12',
        title: 'Lesão no Joelho',
        message: 'Marquinhos Gambeta saiu mancando da partida contra Força Jovem. Vai fazer exames no posto de saúde.',
        type: NotificationType.TEAM_NEWS,
        targetAudience: NotificationAudience.TEAM_FANS,
        teamId: '3',
        isRead: false,
        createdAt: new Date(Date.now() - 518400000)
      }
    ];

    this.notificationsSignal.set(mockNotifications);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
