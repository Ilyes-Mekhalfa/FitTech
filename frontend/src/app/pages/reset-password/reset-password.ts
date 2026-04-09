import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, AuthService, Router],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  passwordForm: FormGroup

  constructor(private fb: FormBuilder,private authService: AuthService, router: Router){
    this.passwordForm = this.fb.group({
      password: ['',[ Validators.required, Validators.minLength(8)]],
      confirmPassword: ['',[Validators.required, Validators.minLength(8), Validators.equals(this.passwordForm.get('password')?.value)]]
    })
  }

  resetPassword(){
    if(this.passwordForm.invalid){
      throw new Error('invalid password or confirmPassword')
    }
    this.authService.resetPassword(this.passwordForm.value).subscribe({
      next: (res)=>{
        console.log('password changed successfully');
        
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }
}
