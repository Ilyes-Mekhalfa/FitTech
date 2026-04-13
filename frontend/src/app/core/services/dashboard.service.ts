import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
   APIUrl = environment.apiUrl

   constructor(private http: HttpClient){}

   dashboard(){
    return this.http.get(`${this.APIUrl}/dashboard`)
   }

   exportData(){
    return this.http.get(`${this.APIUrl}/dashboard/exportData`)
   }
}
