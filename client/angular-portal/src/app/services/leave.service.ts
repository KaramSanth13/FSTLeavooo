import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = 'http://localhost:5000/api/leaves';
  
  // Real-time state management using signals
  leaves = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  fetchLeaves() {
    this.http.get<any>(this.apiUrl).subscribe(data => {
      this.leaves.set(data.data);
    });
  }

  updateLeaveStatus(id: string, status: string) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, { status }).pipe(
      tap(() => this.fetchLeaves())
    );
  }
}
