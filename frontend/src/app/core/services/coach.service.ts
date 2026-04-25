import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CoachService {
  private APIUrl = environment.apiUrl
  constructor(private http: HttpClient){}

  addCoach(coach: any){
    console.log('spo');
    
    return this.http.post<any>(`${this.APIUrl}/coach/add`, coach, {withCredentials: true})
  }

  getAllCoachs(){
    return this.http.get(`${this.APIUrl}/coach/allCoachs`, {withCredentials: true})
  }

  getCoach(id: any){
    return this.http.get(`${this.APIUrl}/coach/${id}`, {withCredentials: true})
  }

  updateCoach(id: any, updatedDAata:any){
    return this.http.put(`${this.APIUrl}/coach/updateCoach/${id}`, updatedDAata, {withCredentials: true})
  }

  deleteCoach(id: any){
    return this.http.delete(`${this.APIUrl}/coach/deleteCoach/${id}`, {withCredentials: true})
  }

}
