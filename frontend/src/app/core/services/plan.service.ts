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

  createPlan(plan:any){
    return this.http.post(`${this.APIUrl}/plan/add`,plan)
  }

  deletePlan(id:string){
    return this.http.delete(`${this.APIUrl}/plan/${id}`, {withCredentials: true})
  }

  updatePlan(id: string, updateDate: any){
    return this.http.patch(`${this.APIUrl}/plan/${id}`, updateDate, {withCredentials: true})
  }
}
