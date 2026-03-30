import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule],
  template: `
    <mat-toolbar class="main-toolbar" *ngIf="authService.isAuthenticated()">
      <div class="logo-section">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 14L10 17L17 10" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 3L4 7V12C4 17 12 21 12 21C12 21 20 17 20 12V7L12 3Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="logo-text">Leavooo</span>
      </div>
      
      <div class="nav-links">
        <a mat-button routerLink="/approvals" routerLinkActive="active-link">Queue</a>
        <a mat-button routerLink="/stats" routerLinkActive="active-link">Analytics</a>
        <a mat-button routerLink="/users" routerLinkActive="active-link" *ngIf="authService.currentUser()?.role === 'Admin'">Users</a>
        <a mat-button routerLink="/settings" routerLinkActive="active-link" *ngIf="authService.currentUser()?.role === 'Admin'">Settings</a>
        <a mat-button routerLink="/add-student" routerLinkActive="active-link" *ngIf="authService.currentUser()?.role === 'Admin'">Add Student</a>
      </div>

      <span class="spacer"></span>

      <div class="user-profile">
        <div class="user-info">
          <span class="user-name">{{ authService.currentUser()?.name }}</span>
          <span class="user-role">{{ authService.currentUser()?.role }}</span>
        </div>
        <button mat-icon-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="logout()">
            <mat-icon>logout</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-toolbar { 
      background: #1e293b; 
      color: white; 
      height: 72px; 
      padding: 0 40px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    .logo-section { display: flex; align-items: center; margin-right: 48px; gap: 10px; }
    .brand-logo { 
      width: 36px; height: 36px; background: #4f46e5; border-radius: 10px; 
      display: flex; align-items: center; justify-content: center; color: white;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
    }
    .brand-logo svg { width: 20px; height: 20px; }
    .logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; color: white; }
    
    .nav-links { display: flex; gap: 8px; }
    .nav-links a { 
      color: #94a3b8; 
      font-weight: 500; 
      font-size: 14px; 
      padding: 0 16px; 
      border-radius: 8px;
    }
    .nav-links a:hover { color: white; background: rgba(255,255,255,0.05); }
    .active-link { color: white !important; background: rgba(129, 140, 248, 0.2) !important; }

    .spacer { flex: 1 1 auto; }

    .user-profile { display: flex; align-items: center; gap: 12px; }
    .user-info { display: flex; flex-direction: column; text-align: right; margin-right: 8px; }
    .user-name { font-size: 14px; font-weight: 600; color: white; }
    .user-role { font-size: 11px; font-weight: 500; color: #94a3b8; text-transform: uppercase; }
    
    .content { padding: 40px; max-width: 1400px; margin: 0 auto; min-height: calc(100vh - 72px); background: #f8fafc; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
