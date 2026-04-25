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

  getMember(id: string){
    return this.http.get(`${this.APIUrl}/member/${id}`, {withCredentials: true})
  }
}
