import { Component, inject } from "@angular/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatBadgeModule } from "@angular/material/badge";
import { Router } from "@angular/router";
import { NotificationService } from "@core/services/notification.service";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltip,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  private router = inject(Router);
  notificationService = inject(NotificationService);

  navigateHome(): void {
    this.router.navigate(["/dashboard"]);
  }

  navigateToNotifications(): void {
    this.router.navigate(["/notifications"]);
  }
}
