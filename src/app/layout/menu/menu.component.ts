import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private router = inject(Router);
  
  isMobile = window.innerWidth <= 768;

  menuItems: MenuItem[] = [
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/dashboard'
    },
    {
      icon: 'groups',
      label: 'Times',
      route: '/teams'
    },
    {
      icon: 'person',
      label: 'Jogadores',
      route: '/players'
    },
    {
      icon: 'sports_soccer',
      label: 'Partidas',
      route: '/matches'
    },
    {
      icon: 'leaderboard',
      label: 'Classificação',
      route: '/ranking'
    },
    {
      icon: 'notifications',
      label: 'Notificações',
      route: '/notifications'
    },
    {
      icon: 'assessment',
      label: 'Relatórios',
      route: '/reports'
    }
  ];

  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });
  }

  onItemClick(item: MenuItem): void {
    if (this.isMobile) {
      // Em dispositivos móveis, fecha o menu após clicar
    }
  }
}
