import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  private APIUrl = environment.apiUrl

  constructor(private http: HttpClient){}

  getAllPlans(){
    return this.http.get(`${this.APIUrl}/plan/allPlans`)
  }
}
