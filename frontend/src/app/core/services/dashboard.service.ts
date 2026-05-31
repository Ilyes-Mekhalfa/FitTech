import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { DashboardDTO } from '../../pages/admin-dashboard/dto/admin-dashboard.dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
   APIUrl = environment.apiUrl

   constructor(private http: HttpClient){}

   dashboard(){
    return this.http.get<DashboardDTO>(`${this.APIUrl}/dashboard`)
   }

   exportData(){
    return this.http.get<string>(`${this.APIUrl}/dashboard/exportData`)
   }

   
}
