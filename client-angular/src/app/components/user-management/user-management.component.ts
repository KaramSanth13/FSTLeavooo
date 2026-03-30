import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { BalanceStatusPipe } from '../../pipes/balance-status.pipe';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatSnackBarModule, BalanceStatusPipe],
  template: `
    <div class="container elevation-z8">
      <div class="header">
        <h2>User Management</h2>
        <button mat-raised-button color="primary" routerLink="/add-student">
          <mat-icon>person_add</mat-icon> New User
        </button>
      </div>

      <table mat-table [dataSource]="authService.users()" class="full-width-table">
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Name </th>
          <td mat-cell *matCellDef="let u"> {{ u.name }} </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef> Email </th>
          <td mat-cell *matCellDef="let u"> {{ u.email }} </td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef> Role </th>
          <td mat-cell *matCellDef="let u"> 
             <span class="role-badge" [ngClass]="u.role">{{ u.role }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="balance">
          <th mat-header-cell *matHeaderCellDef> Balance </th>
          <td mat-cell *matCellDef="let u"> 
             {{ u.leaveBalance }} days 
             <span class="balance-tag" [ngClass]="u.leaveBalance | balanceStatus">{{ u.leaveBalance | balanceStatus }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let u">
            <button mat-icon-button color="warn" (click)="onDelete(u._id)" *ngIf="u.email !== authService.currentUser()?.email">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['name', 'email', 'role', 'balance', 'actions']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['name', 'email', 'role', 'balance', 'actions'];"></tr>
      </table>
      
      <div *ngIf="authService.users().length === 0" class="empty-state">
        <mat-icon inline>people_outline</mat-icon>
        <p>No users registered in the system yet.</p>
      </div>
    </div>
  `,
  styles: [`
    .container { margin: 20px; padding: 20px; background: white; border-radius: 12px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; margin-bottom: 12px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .full-width-table { width: 100%; }
    .role-badge { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; }
    .Admin { background: #fee2e2; color: #991b1b; }
    .HOD { background: #e0f2fe; color: #075985; }
    .Staff { background: #fef3c7; color: #92400e; }
    .Student { background: #f3f4f6; color: #374151; }
    .balance-tag { margin-left: 8px; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; color: white; text-transform: uppercase;}
    .Critical { background: #dc2626; }
    .Low { background: #f59e0b; }
    .Healthy { background: #16a34a; }
  `]
})
export class UserManagementComponent implements OnInit {
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.authService.fetchAllUsers();
  }

  onDelete(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
       this.authService.deleteUser(id).subscribe({
         next: () => this.snackBar.open('User deleted', 'OK', { duration: 2000 }),
         error: () => this.snackBar.open('Delete failed', 'OK', { duration: 2000 })
       });
    }
  }
}
