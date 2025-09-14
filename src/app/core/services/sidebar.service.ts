import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private _isOpen = signal(true);
  private _isMobile = signal(false);

  readonly isOpen = this._isOpen.asReadonly();
  readonly isMobile = this._isMobile.asReadonly();

  constructor() {
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile(): void {
    const mobile = window.innerWidth <= 768;
    this._isMobile.set(mobile);
    
    // Em mobile, o menu inicia fechado; em desktop, aberto
    if (mobile) {
      this._isOpen.set(false);
    } else {
      this._isOpen.set(true);
    }
  }

  toggle(): void {
    this._isOpen.set(!this._isOpen());
  }

  close(): void {
    this._isOpen.set(false);
  }

  open(): void {
    this._isOpen.set(true);
  }
}
