import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-system-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatSlideToggleModule, MatFormFieldModule, MatSliderModule, FormsModule, MatButtonModule, MatIconModule],
  template: `
    <div class="settings-container">
      <div class="header">
        <h2>System Configuration</h2>
        <p>Manage application rules and AI integration thresholds.</p>
      </div>

      <div class="grid">
        <mat-card class="settings-card elevation-z2">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">psychology</mat-icon>
            <mat-card-title>AI Engine Thresholds</mat-card-title>
            <mat-card-subtitle>Define when a leave is tagged as "High Load"</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content style="margin-top: 20px;">
            <div class="setting-row">
              <span>Concurrent Leave Threshold</span>
              <mat-slider min="1" max="20" step="1" showTickMarks discrete>
                <input matSliderThumb [(ngModel)]="threshold">
              </mat-slider>
            </div>
            <div class="setting-row">
              <span style="font-size: 13px; color: #666;">Current value: {{ threshold }} concurrent leaves</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="settings-card elevation-z2">
          <mat-card-header>
            <mat-icon mat-card-avatar color="accent">lock_clock</mat-icon>
            <mat-card-title>Workflow Policies</mat-card-title>
            <mat-card-subtitle>Configure automation and lockout rules</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content style="margin-top: 20px;">
            <div class="setting-row">
              <span>Auto-reject on Low Balance</span>
              <mat-slide-toggle color="primary" [checked]="true"></mat-slide-toggle>
            </div>
            <div class="setting-row">
              <span>Allow Admin to Bypass HOD</span>
              <mat-slide-toggle color="warn" [checked]="false"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <div style="margin-top: 20px; display: flex; justify-content: flex-end;">
        <button mat-raised-button color="primary">
           <mat-icon>save</mat-icon> Update Settings
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { padding: 20px 40px; }
    .header { margin-bottom: 30px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .settings-card { padding: 24px; border-radius: 16px; }
    .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-weight: 500; }
  `]
})
export class SystemSettingsComponent {
  threshold = 5;
}
