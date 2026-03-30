import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { LeaveService } from '../../services/leave.service';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="stats-container">
      <div class="header">
        <h1>Management Insights</h1>
        <p>System-wide leave trends and statistics</p>
      </div>

      <div class="grid">
        <mat-card class="stat-card elevation-z2">
          <div class="icon-circle bg-blue">
            <mat-icon>assessment</mat-icon>
          </div>
          <div class="content">
            <span class="label">Total Applications</span>
            <h2 class="value">{{ getTotal() }}</h2>
          </div>
        </mat-card>

        <mat-card class="stat-card elevation-z2">
          <div class="icon-circle bg-green">
            <mat-icon>check_circle</mat-icon>
          </div>
          <div class="content">
            <span class="label">Total Approved</span>
            <h2 class="value">{{ getCount('Final_Approved') }}</h2>
          </div>
        </mat-card>

        <mat-card class="stat-card elevation-z2">
          <div class="icon-circle bg-red">
            <mat-icon>cancel</mat-icon>
          </div>
          <div class="content">
            <span class="label">Total Rejected</span>
            <h2 class="value">{{ getCount('Rejected') }}</h2>
          </div>
        </mat-card>
      </div>

      <div class="charts-row">
        <mat-card class="chart-card elevation-z2">
          <h3>Leave Status Distribution</h3>
          <div class="simple-bar-chart">
            <div *ngFor="let s of leaveService.stats()?.summary" class="bar-group">
               <div class="bar-label">{{ s._id.replace('_', ' ') }} ({{ s.count }})</div>
               <div class="bar-container">
                 <div class="bar" [style.width.%]="(s.count / getTotal()) * 100" [ngClass]="s._id"></div>
               </div>
            </div>
          </div>
        </mat-card>

        <mat-card class="chart-card elevation-z2">
          <h3>Top Reasons</h3>
          <div class="simple-bar-chart">
            <div *ngFor="let r of leaveService.stats()?.reasons" class="bar-group">
               <div class="bar-label">{{ r._id }}</div>
               <div class="bar-container">
                 <div class="bar bg-indigo" [style.width.%]="(r.count / getTotal()) * 100"></div>
               </div>
            </div>
          </div>
        </mat-card>
      </div>

      <div *ngIf="getTotal() === 0" class="empty-state">
        <mat-icon inline>insights</mat-icon>
        <p>No analytics data available. Statistics will appear once leaves are applied and processed.</p>
      </div>
    </div>
  `,
  styles: [`
    .stats-container { padding: 20px 40px; }
    .empty-state { display: flex; flex-direction: column; align-items: center; padding: 100px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 64px; margin-bottom: 16px; }
    .header { margin-bottom: 30px; }
    .header p { color: #666; margin-top: 5px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 24px; margin-bottom: 30px; }
    .stat-card { padding: 24px; border-radius: 16px; display: flex; align-items: center; gap: 20px; }
    .icon-circle { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; }
    .bg-blue { background: #3b82f6; }
    .bg-green { background: #10b981; }
    .bg-red { background: #ef4444; }
    .bg-indigo { background: #6366f1; }
    .label { font-size: 13px; color: #6b7280; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
    .value { font-size: 28px; font-weight: 700; margin: 4px 0 0 0; }
    
    .charts-row { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .chart-card { padding: 24px; border-radius: 16px; }
    .chart-card h3 { margin-bottom: 20px; font-size: 16px; color: #374151; }
    
    .simple-bar-chart { display: flex; flex-direction: column; gap: 16px; }
    .bar-group { display: flex; flex-direction: column; gap: 6px; }
    .bar-label { font-size: 12px; color: #4b5563; font-weight: 500; }
    .bar-container { height: 8px; background: #f3f4f6; border-radius: 4px; overflow: hidden; }
    .bar { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
    
    .Pending { background: #facc15; }
    .HOD_Approved { background: #60a5fa; }
    .Final_Approved { background: #10b981; }
    .Rejected { background: #ef4444; }
  `]
})
export class DashboardStatsComponent implements OnInit {
  leaveService = inject(LeaveService);

  ngOnInit() {
    this.leaveService.fetchStats();
  }

  getTotal() {
    return this.leaveService.stats()?.summary?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  }

  getCount(status: string) {
    return this.leaveService.stats()?.summary?.find((s: any) => s._id === status)?.count || 0;
  }
}
