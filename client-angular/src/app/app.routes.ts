import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { ApprovalQueueComponent } from './components/approval-queue/approval-queue.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'approvals', component: ApprovalQueueComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/approvals', pathMatch: 'full' },
  { path: '**', redirectTo: '/approvals' }
];
