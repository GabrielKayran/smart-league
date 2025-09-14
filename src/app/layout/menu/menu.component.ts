import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterModule } from '@angular/router';
import { SidebarService } from '@core/services/sidebar.service';

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MatSidenavModule, MatListModule, MatIconModule, MatTooltipModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  private router = inject(Router);
  sidebarService = inject(SidebarService);

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

  onItemClick(item: MenuItem): void {
    this.router.navigate([item.route]);
    
    // Em dispositivos móveis, fecha o menu após clicar
    if (this.sidebarService.isMobile()) {
      this.sidebarService.close();
    }
  }

  isSmallScreen(): boolean {
    return window.innerWidth <= 480;
  }
}
