import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TokenService } from '../../core/services/token.service';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  handleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  forgetPassword() {
    const email = this.loginForm.get('email')?.value;
    this.router.navigate(['/forget-password'], {
      state: { email },
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      throw new Error('form invalid');
    }
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res?.accessToken) {
          this.tokenService.setToken(res.accessToken);
        }
        this.router.navigate(['/admin-dashboard']);
      },
      error: (err) => {
        throw new Error(err.error?.message || err.message || 'Login failed');
      },
    });
  }
}
