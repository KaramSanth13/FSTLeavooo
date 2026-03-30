import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5000/api/leaves' 
      : 'https://leavooo-backend-production.up.railway.app/api/leaves';
  
  // Real-time state utilizing Angular Signals
  leaves = signal<any[]>([]);
  stats = signal<any>(null);

  constructor(private http: HttpClient) {}

  fetchLeaves() {
    this.http.get<any>(this.apiUrl).subscribe(data => {
      this.leaves.set(data.data);
    });
  }

  fetchStats() {
    this.http.get<any>(`${this.apiUrl}/stats/summary`).subscribe(data => {
      this.stats.set(data.data);
    });
  }

  getStats() {
    return this.http.get<any>(`${this.apiUrl}/stats/summary`);
  }

  updateLeaveStatus(id: string, status: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status }).pipe(
      tap(() => this.fetchLeaves()) // Automatically refresh queue on approve/reject
    );
  }
}
