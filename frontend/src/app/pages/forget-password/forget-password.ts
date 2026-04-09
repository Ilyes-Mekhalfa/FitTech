import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from "@angular/router";
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, AuthService, Router],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

  annexCode = new FormControl('', [Validators.required, Validators.pattern(/^ANX-\d{4}$/)])
  constructor(private router: Router, private authService: AuthService){}

  sendEmail(){
    if(this.annexCode.invalid){
      throw new Error('invalid annexCode')
    }
    this.authService.forgetPassword(this.annexCode.value).subscribe({
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
