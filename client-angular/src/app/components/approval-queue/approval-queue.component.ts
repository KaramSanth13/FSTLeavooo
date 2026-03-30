import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { LeaveService } from '../../services/leave.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-approval-queue',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatTableModule, 
    MatChipsModule, 
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule
  ],
  template: `
    <div class="container elevation-z8">
      <div class="header-actions">
        <div>
          <h1 style="margin: 0; font-weight: 500; font-size: 24px;">Approval Queue</h1>
          <p style="color: grey; margin-top: 5px;">Review and manage pending leave requests.</p>
        </div>
        <div class="queue-stats">
          <mat-chip-set>
            <mat-chip color="accent" selected>{{ filteredLeaves().length }} Pending</mat-chip>
          </mat-chip-set>
        </div>
      </div>

      <div class="filter-bar">
        <mat-form-field appearance="outline" style="width: 300px;">
          <mat-label>Search Reason / Name</mat-label>
          <input matInput [(ngModel)]="filterText" (ngModelChange)="applyFilters()" placeholder="Filter...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" style="width: 200px;">
          <mat-label>Priority</mat-label>
          <mat-select [(ngModel)]="filterPriority" (selectionChange)="applyFilters()">
            <mat-option value="all">All Priorities</mat-option>
            <mat-option value="High Load">High Load</mat-option>
            <mat-option value="Risky">Risky</mat-option>
            <mat-option value="Safe">Safe</mat-option>
          </mat-select>
        </mat-form-field>

        <div class="spacer"></div>

        <button mat-raised-button color="primary" 
                [disabled]="selectedIds.size === 0" 
                (click)="bulkAction('Final_Approved')"
                style="margin-right: 8px;">
          Approve Selected ({{ selectedIds.size }})
        </button>
        <button mat-stroked-button color="warn" 
                [disabled]="selectedIds.size === 0"
                (click)="bulkAction('Rejected')">
          Reject Selected
        </button>
      </div>

      <mat-card class="table-card" style="border-radius: 12px; overflow: hidden;">
        <table mat-table [dataSource]="filteredLeaves()" class="full-width-table">
          
          <ng-container matColumnDef="select">
            <th mat-header-cell *matHeaderCellDef>
              <mat-checkbox (change)="$event ? masterToggle() : null"
                            [checked]="isAllSelected()"
                            [indeterminate]="isSomeSelected()">
              </mat-checkbox>
            </th>
            <td mat-cell *matCellDef="let row">
              <mat-checkbox (click)="$event.stopPropagation()"
                            (change)="$event ? toggleSelection(row._id) : null"
                            [checked]="selectedIds.has(row._id)">
              </mat-checkbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="applicant">
            <th mat-header-cell *matHeaderCellDef> Applicant </th>
            <td mat-cell *matCellDef="let leave"> 
              <div style="font-weight: 500;">{{leave.userId?.name || 'Unknown'}}</div>
              <div style="font-size: 12px; color: grey;">{{leave.userId?.role}}</div>
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
              <mat-chip class="risk-chip" [ngClass]="leave.recommendationTag">
                 {{leave.recommendationTag}}
              </mat-chip>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let leave">
              <div class="action-buttons" *ngIf="canApprove(leave)">
                <button mat-icon-button color="primary" (click)="updateStatus(leave._id, 'Final_Approved')">
                   <mat-icon>check_circle</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="updateStatus(leave._id, 'Rejected')">
                   <mat-icon>cancel</mat-icon>
                </button>
              </div>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="['select', 'applicant', 'dates', 'reason', 'ai_tag', 'actions']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['select', 'applicant', 'dates', 'reason', 'ai_tag', 'actions'];" class="element-row"></tr>
        </table>
      </mat-card>
      
      <div *ngIf="filteredLeaves().length === 0" class="empty-state">
        <mat-icon inline>inbox</mat-icon>
        <p>No leave requests found matching your filters.</p>
      </div>
    </div>
  `,
  styles: [`
    .container { margin: 20px; padding: 20px; background: white; border-radius: 12px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; margin-bottom: 12px; }
    .header-actions { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .filter-bar { display: flex; gap: 16px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; }
    .spacer { flex: 1 1 auto; }
    .full-width-table { width: 100%; }
    .action-buttons { display: flex; gap: 5px; }
    .truncate-reason { max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 14px;}
    .element-row:hover { background-color: #f9f9f9; }
    .risk-chip { font-weight: 500; text-transform: uppercase; font-size: 11px; }
    .High_Load { background: #fee2e2 !important; color: #991b1b; }
    .Risky { background: #fef3c7 !important; color: #92400e; }
    .Safe { background: #dcfce7 !important; color: #166534; }
  `]
})
export class ApprovalQueueComponent implements OnInit {
  leaveService = inject(LeaveService);
  authService = inject(AuthService);
  
  filterText = '';
  filterPriority = 'all';
  filteredLeaves = signal<any[]>([]);
  selectedIds = new Set<string>();

  constructor() {
    effect(() => {
      this.applyFilters();
    }, { allowSignalWrites: true });
  }

  ngOnInit() {
    this.leaveService.fetchLeaves();
  }

  applyFilters() {
    let data = this.leaveService.leaves();
    
    if (this.filterText) {
      const text = this.filterText.toLowerCase();
      data = data.filter(l => 
        l.reason?.toLowerCase().includes(text) || 
        l.userId?.name?.toLowerCase().includes(text)
      );
    }
    
    if (this.filterPriority !== 'all') {
      data = data.filter(l => l.recommendationTag === this.filterPriority);
    }
    
    this.filteredLeaves.set(data);
  }

  toggleSelection(id: string) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  isAllSelected() {
    const numSelected = this.selectedIds.size;
    const numRows = this.filteredLeaves().length;
    return numSelected === numRows && numRows > 0;
  }

  isSomeSelected() {
    const numSelected = this.selectedIds.size;
    const numRows = this.filteredLeaves().length;
    return numSelected > 0 && numSelected < numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selectedIds.clear();
    } else {
      this.filteredLeaves().forEach(row => this.selectedIds.add(row._id));
    }
  }

  async bulkAction(status: string) {
    if (confirm(`Action will apply to ${this.selectedIds.size} applications. Proceed?`)) {
      const ids = Array.from(this.selectedIds);
      // Sequentially update to avoid race conditions on leaveBalance if multiple final approvals
      for (const id of ids) {
        await this.leaveService.updateLeaveStatus(id, status).toPromise();
      }
      this.selectedIds.clear();
      this.leaveService.fetchLeaves();
    }
  }

  updateStatus(id: string, status: string) {
    this.leaveService.updateLeaveStatus(id, status).subscribe();
  }

  canApprove(leave: any): boolean {
    const role = this.authService.currentUser()?.role;
    if (!role || !leave) return false;
    
    if (role === 'HOD' && leave.status === 'Pending') return true;
    if (role === 'Admin' && (leave.status === 'Pending' || leave.status === 'HOD_Approved')) return true;
    
    return false;
  }
}

