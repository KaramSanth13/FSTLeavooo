import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { ApprovalDashboardComponent } from './components/approval-dashboard/approval-dashboard.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [authGuard] },
  { path: 'approvals', component: ApprovalDashboardComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/approvals', pathMatch: 'full' }
];
