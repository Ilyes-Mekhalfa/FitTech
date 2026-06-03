import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { DashboardDTO } from '../../pages/admin-dashboard/dto/admin-dashboard.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  APIUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generalStats() {
    return this.http.get<string>(`${this.APIUrl}/dashboard/stats`);
  }

  coachStats() {
    return this.http.get<string>(`${this.APIUrl}/dashboard/coachStats`);
  }

  memberStats() {
    return this.http.get<string>(`${this.APIUrl}/dashboard/memberStats`);
  }

  planStats() {
    return this.http.get<string>(`${this.APIUrl}/dashboard/planStats`);
  }

  dailyToken() {
    return this.http.get(`${this.APIUrl}/admin/dailyToken`);
  }

  liveEnterance() {
    return this.http.get(`${this.APIUrl}/dashboard/liveEnterance`);
  }
}
