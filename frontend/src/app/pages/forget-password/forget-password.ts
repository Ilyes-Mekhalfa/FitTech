import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from "@angular/router";
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

  email = history.state.email || '';
  constructor(private router: Router, private authService: AuthService){}

  sendEmail(){
    if(this.email.invalid){
      throw new Error('invalid email')
    }
    this.authService.forgetPassword(this.email.value).subscribe({
      next: (res)=>{
        console.log('email sent successfully');
      },
      error: (err)=>{
        throw new Error(err.error.message)
      }
    })
  }

  backToLogin(){
    this.router.navigate(['/login'])
  }
}
