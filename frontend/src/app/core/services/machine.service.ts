import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root',
})
export class MachineService {
  APIUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getMachines(){
    return this.http.get(`${this.APIUrl}/machine`,{withCredentials: true});
  }

  getMachine(id: string){
    return this.http.get(`${this.APIUrl}/machine/${id}`,{withCredentials: true});
  }

  addMachine(machine: any){
    return this.http.post(`${this.APIUrl}/machine`, machine, {withCredentials: true})
  }

  updateMachine(id: string, updateDate: any){
    return this.http.patch(`${this.APIUrl}/machine/${id}`, updateDate, {withCredentials: true})
  }

  deleteMachine(id: string){
    return this.http.delete(`${this.APIUrl}/machine/${id}`, {withCredentials: true})
  }
}
