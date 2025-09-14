export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  targetAudience: NotificationAudience;
  teamId?: string;
  isRead: boolean;
  createdAt: Date;
  readAt?: Date;
}

export enum NotificationType {
  INFO = 'Informação',
  SUCCESS = 'Sucesso',
  WARNING = 'Aviso',
  ERROR = 'Erro',
  MATCH_UPDATE = 'Atualização de Partida',
  TEAM_NEWS = 'Notícias do Time'
}

export enum NotificationAudience {
  ALL = 'Todos',
  TEAM_FANS = 'Torcedores do Time',
  ADMINS = 'Administradores'
}

export interface NotificationPreferences {
  userId: string;
  teamId?: string;
  enableMatchUpdates: boolean;
  enableTeamNews: boolean;
  enableGeneralNews: boolean;
  emailNotifications: boolean;
}
