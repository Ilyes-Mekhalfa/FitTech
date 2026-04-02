import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  
  getToken(): string | null {
    return 'true'
  }

  deleteToken(): void {
    // to be implemented when the backend is set up
    }
}
