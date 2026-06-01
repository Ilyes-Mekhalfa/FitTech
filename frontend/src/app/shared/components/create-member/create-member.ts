import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MemberService } from '../../../core/services/member.service';

@Component({
  selector: 'app-create-member',
  imports: [ReactiveFormsModule],
  templateUrl: './create-member.html',
  styleUrl: './create-member.css',
})
export class CreateMember {
  currentStep = 1;

  stepOne: FormGroup;
  stepTwo: FormGroup;
  stepThree: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private memberService: MemberService) {
    this.stepOne = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{0,15}$/)]]
    });

    this.stepTwo = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', Validators.required]
    },
      { validators: this.passwordMatchValidator });

    this.stepThree = this.fb.group({
      date_of_birth: ['', Validators.required],
      health_goal: ['', Validators.required],
      medical_restrictions: ['']
    });
  }

  nextStep() {

    if (this.currentStep === 1 && this.stepOne.valid) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.stepTwo.valid) {
      this.currentStep = 3;
    } else if (this.currentStep === 3 && this.stepThree.valid) {
      this.submit();
    }
  }

  back() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  submit() {
    const data = {
      ...this.stepOne.value,
      ...this.stepTwo.value,
      ...this.stepThree.value
    }
    this.memberService.addMember(data).subscribe({
      next: (res:any)=>{
        console.log(res);
        this.router.navigate(['/members'])
      },
      error: (err:any)=>{
        console.log(err);
        
      }
    })
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirm_pw')?.value
      ? null : { 'mismatch': true };
  }
}
