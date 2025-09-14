import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadComponent: () => import('@app/features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },

  {
    path: 'teams',
    loadComponent: () => import('@app/features/teams/team-list/team-list.component').then(m => m.TeamListComponent),
  },
  {
    path: 'teams/create',
    loadComponent: () => import('@app/features/teams/team-form/team-form.component').then(m => m.TeamFormComponent),
  },
  {
    path: 'teams/:id',
    loadComponent: () => import('@app/features/teams/team-detail/team-detail.component').then(m => m.TeamDetailComponent),
  },

  {
    path: 'players',
    loadComponent: () => import('@app/features/teams/player-list/player-list.component').then(m => m.PlayerListComponent),
  },
  {
    path: 'players/create',
    loadComponent: () => import('@app/features/teams/player-form/player-form.component').then(m => m.PlayerFormComponent),
  },

  {
    path: 'matches',
    loadComponent: () => import('@app/features/matches/match-list/match-list.component').then(m => m.MatchListComponent),
  },
  {
    path: 'matches/create',
    loadComponent: () => import('@app/features/matches/match-form/match-form.component').then(m => m.MatchFormComponent),
  },
  {
    path: 'matches/:id',
    loadComponent: () => import('@app/features/matches/match-detail/match-detail.component').then(m => m.MatchDetailComponent),
  },

  {
    path: 'ranking',
    loadComponent: () => import('@app/features/ranking/ranking.component').then(m => m.RankingComponent),
  },

  {
    path: 'notifications',
    loadComponent: () => import('@app/features/notifications/notification-list/notification-list.component').then(m => m.NotificationListComponent),
  },

  {
    path: 'reports',
    loadComponent: () => import('@app/features/reports/report-dashboard/report-dashboard.component').then(m => m.ReportDashboardComponent),
  },
  {
    path: 'reports/player/:id',
    loadComponent: () => import('@app/features/reports/player-report/player-report.component').then(m => m.PlayerReportComponent),
  },
  {
    path: 'reports/team/:id',
    loadComponent: () => import('@app/features/reports/team-report/team-report.component').then(m => m.TeamReportComponent),
  },

  { path: '**', redirectTo: '/dashboard' },
];
