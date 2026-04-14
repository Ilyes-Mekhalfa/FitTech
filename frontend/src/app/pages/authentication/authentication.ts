import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, NgIf, ReactiveFormsModule],
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  handleShowPassword() {
    this.showPassword = !this.showPassword
  }

  forgetPassword() {
    this.router.navigate(['/forget-password'])
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      throw new Error('form invalid')
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.router.navigate(['/admin-dashboard'])
      },
      error: (err) => {
        throw new Error(err.error.message)
      }
    });
  }


}