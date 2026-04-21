import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoachService } from '../../../core/services/coach.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-coach',
  imports: [ReactiveFormsModule],
  templateUrl: './create-coach.html',
  styleUrl: './create-coach.css',
})
export class CreateCoach {
  createCoachForm: FormGroup;
  showPw = false
  showCpw = false
  specInput = ''
  specialties: string[] = []
  exp = 0
  
  //to be continued later
  constructor(private fb: FormBuilder, private coachService: CoachService, private router: Router){
    this.createCoachForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      phone: ['', Validators.required, Validators.pattern('^[0-9]{8}$')],
      password: ['', Validators.required, Validators.minLength(8)],
      confirm_pw: ['', Validators.required],
      biography: ['', Validators.required],
      specialties: ['', Validators.required],
      experience: ['', Validators.required],
    })
  }

  submit(){
    if (this.createCoachForm.invalid) {
      throw new Error('form is invalid')
    }
  }

  exit(){
    this.router.navigate(['/coachs'])
  }

  removeSpec(){}
}
