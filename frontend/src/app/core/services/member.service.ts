import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private APIUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  getAllMembers(){
    return this.http.get(`${this.APIUrl}/member/allMembers`, {withCredentials: true})
  }

  addMember(data: any){
    return this.http.post(`${this.APIUrl}/member/add`, data, {withCredentials: true})
  }
  
  getMember(id: string){
    return this.http.get(`${this.APIUrl}/member/${id}`, {withCredentials: true})
  }

  updateMember(id: string, data: any){
    return this.http.put(`${this.APIUrl}/member/${id}`, data, {withCredentials: true})
  }

  getAvailablePlans(){
    return this.http.get(`${this.APIUrl}/subscription/plans`, {withCredentials: true})
  }

  updateSubscription(memberId: string, data: any){
    return this.http.put(`${this.APIUrl}/member/${memberId}/subscription`, data, {withCredentials: true})
  }
}
