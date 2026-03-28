import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="admin-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Admin Dashboard</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <p>User management interface goes here. Admins can add or remove users.</p>
          <!-- Additional admin functionalities per requirements could be expanded here. -->
          <div class="user-list">
             <h3>Manage Users</h3>
             <p>Placeholder for User Grid (Add/Remove)</p>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .admin-container { padding: 20px; }
  `]
})
export class AdminDashboardComponent {}
