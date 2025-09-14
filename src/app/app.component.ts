import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { MenuComponent } from "@app/layout/menu/menu.component";
import { HeaderComponent } from "@app/layout/header/header.component";
import { SidebarService } from "@core/services/sidebar.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, MenuComponent, HeaderComponent],
  template: `
    <div class="app-container">
      <app-header />
      <div class="content-wrapper">
        <app-menu />
        <main
          class="main-content"
          [class.content-shifted]="
            !sidebarService.isMobile() && sidebarService.isOpen()
          "
        >
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      .content-wrapper {
        display: flex;
        flex: 1;
        overflow: hidden;
        position: relative;
      }

      .main-content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
        background-color: #f5f5f5;
        transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        margin-left: 0;
        width: 100%;
      }

      .main-content.content-shifted {
        width: calc(100% - 280px);
      }

      @media (max-width: 768px) {
        .main-content {
          padding: 16px;
          margin-left: 0 !important;
          width: 100% !important;
        }
      }
    `,
  ],
})
export class AppComponent {
  title = "smart-league";
  sidebarService = inject(SidebarService);
}
