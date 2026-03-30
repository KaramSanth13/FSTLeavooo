import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Uses window.location to determine if we are deployed to dynamically hit the right API
  private apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api/auth' 
      : 'https://fstleavooo-production.up.railway.app/api/auth';
  
  currentUser = signal<any>(null);
  isAuthenticated = signal<boolean>(false);
  users = signal<any[]>([]);

  constructor(private http: HttpClient, private router: Router) {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUser.set(JSON.parse(user));
      this.isAuthenticated.set(true);
    }
  }

  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if (res.user.role === 'Admin' || res.user.role === 'HOD') {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.currentUser.set(res.user);
          this.isAuthenticated.set(true);
        } else {
          throw new Error('Only Admin and HOD roles can access the Approver Portal.');
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  fetchAllUsers() {
    this.http.get<any>(`${this.apiUrl}/users`).subscribe(res => {
      this.users.set(res.data);
    });
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/users/${id}`).pipe(
      tap(() => this.fetchAllUsers())
    );
  }
}
