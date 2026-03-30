import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-student',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatInputModule, MatButtonModule, MatSelectModule, MatSnackBarModule],
  template: `
    <div class="add-container">
      <mat-card class="add-card elevation-z4">
        <mat-card-header>
          <mat-card-title>Add New User</mat-card-title>
          <mat-card-subtitle>Create student, staff or admin accounts</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content style="margin-top: 20px;">
          <form (ngSubmit)="onSubmit()" #userForm="ngForm">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput [(ngModel)]="user.name" name="name" required>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email (determines role automagically)</mat-label>
              <input matInput type="email" [(ngModel)]="user.email" name="email" required placeholder="example@student.ceg.in">
              <mat-hint>Use &#64;student.ceg.in, admin&#64;ceg.in, or &#64;hod.dept.ceg.in</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width" style="margin-top: 10px;">
              <mat-label>Password</mat-label>
              <input matInput type="password" [(ngModel)]="user.password" name="password" required>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!userForm.valid || loading" class="full-width">
               {{ loading ? 'Creating...' : 'Create Account' }}
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .add-container { display: flex; justify-content: center; padding: 40px 20px; }
    .add-card { width: 100%; max-width: 500px; padding: 20px; border-radius: 12px; }
    .full-width { width: 100%; margin-bottom: 10px; }
  `]
})
export class AddStudentComponent {
  user = { name: '', email: '', password: '' };
  loading = false;
  
  private http = inject(HttpClient);
  private snackBar = inject(MatSnackBar);
  
  private apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api/auth' 
      : 'https://leavooo-backend-api.onrender.com/api/auth';

  onSubmit() {
    this.loading = true;
    this.http.post(`${this.apiUrl}/register`, this.user).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('User successfully created!', 'Close', { duration: 3000 });
        this.user = { name: '', email: '', password: '' }; // reset form
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open(err.error?.error || 'Failed to create user', 'Close', { duration: 4000 });
      }
    });
  }
}
