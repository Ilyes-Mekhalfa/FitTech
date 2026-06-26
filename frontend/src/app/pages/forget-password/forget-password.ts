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

  email = new FormControl(history.state.email || '', [Validators.required, Validators.email]);
  constructor(private router: Router, private authService: AuthService){}

  sendEmail(){
    if(this.email.invalid || !this.email.value){
      throw new Error('invalid email')
    }
    this.authService.forgetPassword({ email: this.email.value }).subscribe({
      next: (res)=>{
        console.log('email sent successfully');
        this.router.navigate(['/login']);
      },
      error: (err)=>{
        throw new Error(err.error?.message || err.message || 'Error occurred');
      }
    })
  }

  backToLogin(){
    this.router.navigate(['/login'])
  }
}
