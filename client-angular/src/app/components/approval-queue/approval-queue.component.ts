import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTableModule, MatChipsModule, MatIconModule],
  template: `
    <div class="dashboard-container">
      <div class="header-section">
        <h1 style="margin: 0; font-weight: 500; font-size: 24px;">Approval Queue</h1>
        <p style="color: grey; margin-top: 5px;">Review and manage pending leave requests across the institution.</p>
      </div>

      <mat-card class="table-card elevation-z2" style="border-radius: 12px; overflow: hidden;">
        <table mat-table [dataSource]="getActiveLeaves()" class="full-width-table">
          
          <ng-container matColumnDef="applicant">
            <th mat-header-cell *matHeaderCellDef> Applicant </th>
            <td mat-cell *matCellDef="let leave"> 
              <div style="font-weight: 500;">{{leave.userId?.name || 'Unknown'}}</div>
              <div style="font-size: 12px; color: grey;">{{leave.userId?.role}} • Bal: {{leave.userId?.leaveBalance}}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="dates">
            <th mat-header-cell *matHeaderCellDef> Duration </th>
            <td mat-cell *matCellDef="let leave"> 
               {{leave.startDate | date:'mediumDate'}} <br> <span style="color: grey; font-size: 12px;">to</span> {{leave.endDate | date:'mediumDate'}} 
            </td>
          </ng-container>

          <ng-container matColumnDef="reason">
            <th mat-header-cell *matHeaderCellDef> Reason </th>
            <td mat-cell *matCellDef="let leave"> 
               <div class="truncate-reason" [title]="leave.reason">{{leave.reason}}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="ai_tag">
            <th mat-header-cell *matHeaderCellDef> AI Insight </th>
            <td mat-cell *matCellDef="let leave"> 
              <mat-chip-set>
                <mat-chip class="custom-chip" [ngClass]="getTagClass(leave.recommendationTag)">
                   <mat-icon *ngIf="leave.recommendationTag === 'High Load'" style="margin-right: -4px; margin-left: -5px; transform: scale(0.8);">warning</mat-icon>
                   <mat-icon *ngIf="leave.recommendationTag === 'Risky'" style="margin-right: -4px; margin-left: -5px; transform: scale(0.8);">error_outline</mat-icon>
                   <mat-icon *ngIf="leave.recommendationTag === 'Safe'" style="margin-right: -4px; margin-left: -5px; transform: scale(0.8);">check_circle</mat-icon>
                   {{leave.recommendationTag}}
                </mat-chip>
              </mat-chip-set>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Current State </th>
            <td mat-cell *matCellDef="let leave"> 
               <span class="status-badge" [ngClass]="leave.status">
                 {{leave.status.replace('_', ' ')}}
               </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let leave">
              <div class="action-buttons" *ngIf="canApprove(leave)">
                <button mat-flat-button color="primary" (click)="approve(leave)" style="border-radius: 20px;">
                   <mat-icon>thumb_up</mat-icon> Approve
                </button>
                <button mat-stroked-button color="warn" (click)="reject(leave._id)" style="border-radius: 20px;">
                   Reject
                </button>
              </div>
              <div *ngIf="!canApprove(leave)" style="color: grey; font-size: 13px; font-style: italic;">
                 No actions available
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="element-row"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="6" style="padding: 40px; text-align: center; color: grey;">
               <mat-icon style="font-size: 40px; width: 40px; height: 40px; color: #ccc;">inbox</mat-icon>
               <p style="margin-top: 10px; font-size: 16px;">Queue is empty. No pending leaves to review.</p>
            </td>
          </tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 0 0 40px 0; }
    .header-section { margin-bottom: 25px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;}
    .full-width-table { width: 100%; }
    .action-buttons { display: flex; gap: 10px; }
    .truncate-reason { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px;}
    .element-row:hover { background-color: #f9f9f9; transition: background 0.2s;}
    
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; display: inline-block; text-transform: uppercase;}
    .Pending { background-color: #fff8e1; color: #ff8f00; border: 1px solid #ffe082;}
    .HOD_Approved { background-color: #e3f2fd; color: #1565c0; border: 1px solid #90caf9;}
    .Final_Approved { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7;}
    .Rejected { background-color: #ffebee; color: #c62828; border: 1px solid #ef9a9a;}

    .custom-chip { font-weight: 500 !important; }
    .chip-warn { background-color: #fce4e4 !important; color: #c62828 !important; border: 1px solid #ef9a9a !important; }
    .chip-accent { background-color: #fff3e0 !important; color: #e65100 !important; border: 1px solid #ffcc80 !important; }
    .chip-primary { background-color: #e8eaf6 !important; color: #283593 !important; border: 1px solid #9fa8da !important; }
  `]
})
export class ApprovalQueueComponent implements OnInit {
  leaveService = inject(LeaveService);
  authService = inject(AuthService);
  displayedColumns: string[] = ['applicant', 'dates', 'reason', 'ai_tag', 'status', 'actions'];

  ngOnInit() {
    this.leaveService.fetchLeaves();
  }

  getActiveLeaves() {
     return this.leaveService.leaves().filter(l => l.status === 'Pending' || l.status === 'HOD_Approved');
  }

  getTagClass(tag: string): string {
    switch (tag) {
      case 'High Load': return 'chip-warn';
      case 'Risky': return 'chip-accent';
      case 'Safe': return 'chip-primary';
      default: return '';
    }
  }

  canApprove(leave: any): boolean {
    const role = this.authService.currentUser()?.role;
    if (!role) return false;
    
    if (role === 'HOD' && leave.status === 'Pending') return true;
    if (role === 'Admin' && (leave.status === 'Pending' || leave.status === 'HOD_Approved')) return true;
    
    return false;
  }

  approve(leave: any) {
    const role = this.authService.currentUser()?.role;
    let nextStatus = 'Final_Approved';
    
    if (role === 'HOD' && leave.status === 'Pending') nextStatus = 'HOD_Approved';
    this.leaveService.updateLeaveStatus(leave._id, nextStatus).subscribe();
  }

  reject(leaveId: string) {
    this.leaveService.updateLeaveStatus(leaveId, 'Rejected').subscribe();
  }
}
