import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbarModule, MatButtonModule, RouterLink],
  template: `
    <mat-toolbar color="primary" *ngIf="authService.isAuthenticated()">
      <span>Admin Portal</span>
      <span class="spacer"></span>
      <button mat-button routerLink="/admin">Users</button>
      <button mat-button routerLink="/approvals">Approvals</button>
      <button mat-button (click)="logout()">Logout</button>
    </mat-toolbar>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
    .content { padding: 20px; }
  `]
})
export class AppComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
