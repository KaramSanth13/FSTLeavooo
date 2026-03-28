import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-approval-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTableModule, MatChipsModule],
  template: `
    <div class="dashboard-container">
      <h2>Leave Approvals</h2>
      <mat-card class="table-card">
        <table mat-table [dataSource]="leaveService.leaves()" class="mat-elevation-z8">
          
          <ng-container matColumnDef="student">
            <th mat-header-cell *matHeaderCellDef> Student </th>
            <td mat-cell *matCellDef="let leave"> {{leave.userId?.name}} ({{leave.userId?.role}}) </td>
          </ng-container>

          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef> Dates </th>
            <td mat-cell *matCellDef="let leave"> {{leave.startDate | date}} - {{leave.endDate | date}} </td>
          </ng-container>

          <ng-container matColumnDef="reason">
            <th mat-header-cell *matHeaderCellDef> Reason </th>
            <td mat-cell *matCellDef="let leave"> {{leave.reason}} </td>
          </ng-container>

          <ng-container matColumnDef="tag">
            <th mat-header-cell *matHeaderCellDef> AI Insight </th>
            <td mat-cell *matCellDef="let leave"> 
              <mat-chip-set>
                <mat-chip [color]="getTagColor(leave.recommendationTag)" selected>
                  {{leave.recommendationTag}}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let leave"> {{leave.status.replace('_', ' ')}} </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let leave">
              <div class="action-buttons" *ngIf="canApprove(leave)">
                <button mat-raised-button color="primary" (click)="approveLeave(leave)">Approve</button>
                <button mat-raised-button color="warn" (click)="rejectLeave(leave._id)">Reject</button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    .table-card { margin-top: 20px; overflow-x: auto; }
    table { width: 100%; }
    .action-buttons button { margin-right: 8px; }
  `]
})
export class ApprovalDashboardComponent implements OnInit {
  leaveService = inject(LeaveService);
  authService = inject(AuthService);
  displayedColumns: string[] = ['student', 'dates', 'reason', 'tag', 'status', 'actions'];

  ngOnInit() {
    this.leaveService.fetchLeaves();
  }

  getTagColor(tag: string): string {
    switch (tag) {
      case 'Safe': return 'primary';
      case 'High Load': return 'warn';
      case 'Risky': return 'accent';
      default: return '';
    }
  }

  canApprove(leave: any): boolean {
    const role = this.authService.currentUser().role;
    if (role === 'Staff' && leave.status === 'Pending') return true;
    if (role === 'HOD' && (leave.status === 'Pending' || leave.status === 'HOD_Approved')) return true;
    if (role === 'Admin') return true;
    return false;
  }

  approveLeave(leave: any) {
    const role = this.authService.currentUser().role;
    let newStatus = 'Final_Approved';
    if (role === 'Staff' && leave.status === 'Pending') {
      newStatus = 'HOD_Approved';
    }
    this.leaveService.updateLeaveStatus(leave._id, newStatus).subscribe();
  }

  rejectLeave(leaveId: string) {
    this.leaveService.updateLeaveStatus(leaveId, 'Rejected').subscribe();
  }
}
