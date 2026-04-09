import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './authentication.html',
  styleUrl: './authentication.css',
})
export class LoginComponent  {
  loginForm: FormGroup;
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService){
    this.loginForm = this.fb.group({
      annexCode: ['',[Validators.required, Validators.pattern(/^ANX-\d{3}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  handleShowPassword(){
    this.showPassword = !this.showPassword
  }

  
}