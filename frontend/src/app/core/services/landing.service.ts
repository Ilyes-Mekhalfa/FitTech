import { Injectable } from '@angular/core';
import { environment} from '../../environment/environment'
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class LandingService {
  APIUrl = environment.apiUrl

  constructor(private http: HttpClient){}

  getHeroData(){
    return this.http.get(`${this.APIUrl}/landing/hero`)
  }

  getCoachData(){
    return this.http.get(`${this.APIUrl}/landing/coaches`)
  }

  getPlansData(){
    return this.http.get(`${this.APIUrl}/landing/plans`,{withCredentials: true})
  }
}
