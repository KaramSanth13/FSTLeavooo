import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" *ngIf="authService.isAuthenticated()" class="elevation-z4">
      <mat-icon style="margin-right: 8px;">verified_user</mat-icon>
      <span>Approver Portal | {{ authService.currentUser()?.role }}</span>
      <span class="spacer"></span>
      <span style="font-size: 14px; margin-right: 16px;">{{ authService.currentUser()?.name }}</span>
      <button mat-button (click)="logout()">Logout</button>
    </mat-toolbar>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .content { padding: 20px; max-width: 1200px; margin: 0 auto; }
    .elevation-z4 { box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12); z-index: 10; position: relative;}
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
