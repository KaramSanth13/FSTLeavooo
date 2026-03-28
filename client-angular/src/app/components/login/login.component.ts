import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule],
  template: `
    <div class="login-container">
      <mat-card class="login-card elevation-z8">
        <mat-card-header>
          <div mat-card-avatar class="header-icon"><mat-icon color="primary" style="font-size: 40px; width: 40px; height: 40px;">admin_panel_settings</mat-icon></div>
          <mat-card-title style="margin-left: 10px; margin-top: 5px;">Approver Portal Login</mat-card-title>
          <mat-card-subtitle style="margin-left: 10px;">Vidumurai Admin/HOD Only</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content style="margin-top: 30px;">
          <form (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput [(ngModel)]="email" name="email" required placeholder="admin@collegename.edu">
              <mat-icon matSuffix>email</mat-icon>
            </mat-form-field>
            <mat-form-field appearance="outline" class="full-width" style="margin-top: 10px;">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="password" name="password" required>
              <mat-icon matSuffix>lock</mat-icon>
            </mat-form-field>
            
            <div *ngIf="error" class="error-msg">
              <mat-icon style="font-size: 18px; width: 18px; margin-right: 5px; vertical-align: bottom;">error</mat-icon>
              {{ error }}
            </div>
            
            <button mat-raised-button color="primary" type="submit" class="full-width login-btn" [disabled]="loading">
              {{ loading ? 'Authenticating...' : 'Sign In' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container { display: flex; justify-content: center; align-items: center; height: 80vh; background-color: #f5f5f5;}
    .login-card { width: 450px; padding: 30px 20px; border-radius: 12px; }
    .full-width { width: 100%; }
    .login-btn { padding: 8px 0; margin-top: 15px; font-size: 16px; border-radius: 8px; }
    .error-msg { color: #f44336; margin-bottom: 20px; font-weight: 500; display: flex; align-items: center; background: #ffebee; padding: 10px; border-radius: 4px;}
    .header-icon { margin-right: 15px; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.loading = true;
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
         this.loading = false;
         this.router.navigate(['/approvals']);
      },
      error: (err) => {
         this.loading = false;
         this.error = err.message || err.error?.error || 'Login failed';
      }
    });
  }
}
