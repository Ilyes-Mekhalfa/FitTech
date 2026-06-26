import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  passwordForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ){
    this.passwordForm = this.fb.group({
      password: ['',[ Validators.required, Validators.minLength(8)]],
      confirmPassword: ['',[Validators.required, Validators.minLength(8)]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      const confirmErrors = formGroup.get('confirmPassword')?.errors;
      if (confirmErrors) {
        delete confirmErrors['mismatch'];
        if (Object.keys(confirmErrors).length === 0) {
          formGroup.get('confirmPassword')?.setErrors(null);
        } else {
          formGroup.get('confirmPassword')?.setErrors(confirmErrors);
        }
      }
      return null;
    }
  }

  resetPassword(){
    if(this.passwordForm.invalid){
      throw new Error('invalid password or confirmPassword')
    }
    const resetToken = this.route.snapshot.queryParams['token'] || this.route.snapshot.queryParams['reset_token'] || '';
    if (!resetToken) {
      throw new Error('Missing or invalid password reset token');
    }
    const payload = {
      password: this.passwordForm.value.password,
      confirmPassword: this.passwordForm.value.confirmPassword,
      resetToken: resetToken
    };
    this.authService.resetPassword(payload).subscribe({
      next: (res)=>{
        this.router.navigate(['/login'])
      },
      error: (err)=>{
        console.log(err);
      }
    })
  }
}
