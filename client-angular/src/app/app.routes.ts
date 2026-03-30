import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ApprovalQueueComponent } from './components/approval-queue/approval-queue.component';
import { AddStudentComponent } from './components/add-student/add-student.component';
import { DashboardStatsComponent } from './components/dashboard-stats/dashboard-stats.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { SystemSettingsComponent } from './components/system-settings/system-settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'approvals', component: ApprovalQueueComponent, canActivate: [authGuard] },
  { path: 'stats', component: DashboardStatsComponent, canActivate: [authGuard] },
  { path: 'users', component: UserManagementComponent, canActivate: [authGuard] },
  { path: 'settings', component: SystemSettingsComponent, canActivate: [authGuard] },
  { path: 'add-student', component: AddStudentComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/approvals', pathMatch: 'full' },
  { path: '**', redirectTo: '/approvals' }
];
