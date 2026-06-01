import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CoachService } from '../../../core/services/coach.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.guard';
@Component({
  selector: 'app-create-coach',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-coach.html',
  styleUrl: './create-coach.css',
})
export class CreateCoach implements OnInit, CanComponentDeactivate {
  createCoachForm: FormGroup;
  showPw = false;
  showCpw = false;

  specialties: string = 'Football';
  exp = 0;
  progress = 0;

  constructor(
    private fb: FormBuilder,
    private coachService: CoachService,
    private router: Router
  ) {
    this.createCoachForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_pw: ['', Validators.required],
      biography: ['', Validators.required],
      years_of_experience: [this.exp, Validators.required],
      specialties: [this.specialties, Validators.required],
    }, { validator: this.passwordMatchValidator });
  }

  //to fill or unfill the progress bar
  ngOnInit() {
    this.createCoachForm.valueChanges.subscribe(() => {
      this.calculateProgress();
    });
  }

  calculateProgress() {
    const controls = this.createCoachForm.controls;
    const totalFields = Object.keys(controls).length + 2;
    let filledFields = 0;

    for (const key in controls) {
      if (controls[key].valid && controls[key].value) filledFields++;
    }

    if (this.specialties.length > 0) filledFields++;
    if (this.exp > 0) filledFields++;

    this.progress = Math.round((filledFields / totalFields) * 100);
  }

  //password matchs
  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirm_pw')?.value
      ? null : { 'mismatch': true };
  }


  updateExp(value: number) {
    this.exp = Math.max(0, this.exp + value);
    this.calculateProgress();
  }

  submit() {
    if (this.createCoachForm.invalid) {
      throw new Error('invalid form data')
    }
    const payload = {
      ...this.createCoachForm.value,
      specialties: this.specialties,
      experience: this.exp
    };

    this.coachService.addCoach(payload).subscribe({
      next: (res: any) => {
        this.router.navigate(['/coachs']);
      },
      error: (err) => console.error('Error:', err)
    });

  }

  canDeactivate(): boolean {
    if (this.createCoachForm.dirty) {
      return confirm('All unsaved changes will be lost. Are you sure you want to leave?');
    }
    this.router.navigate(['/coachs']);
    return true
  }

}