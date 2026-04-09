import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private APIUrl = environment.apiUrl;

  constructor(private http: HttpClient){}

  login(payload: any){
    return this.http.post(`${this.APIUrl}/authentication/login`, payload, {
      withCredentials: true
    })
  }

  logout(){
    return this.http.post(`${this.APIUrl}/authentication/logout`,{},{
      withCredentials: true
    })
  }

  forgetPassword(payload: any){
    return this.http.post(`${this.APIUrl}/authentication/forgetPassword`, payload,{
      withCredentials: true
    })
  }

  resetPassword(payload: any){
    return this.http.post(`${this.APIUrl}/authentication/resetPassword`, payload, {
      withCredentials: true,
    })
  }
}
