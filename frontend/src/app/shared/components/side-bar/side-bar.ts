import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-bar.html',
  styleUrl: './side-bar.css',
})
export class SideBar {

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
  ){}

  logout(){
    this.authService.logout().subscribe({
      next: () => {
        this.tokenService.deleteToken();
        this.router.navigate(['/login']);
      },
      error: () => {
        this.tokenService.deleteToken();
        this.router.navigate(['/login']);
      }
    });
  }
}
