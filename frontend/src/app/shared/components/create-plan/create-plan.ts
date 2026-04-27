import { Component } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-create-plan',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-plan.html',
  styleUrls: ['./create-plan.css'],
})
export class CreatePlan {

  createPlanForm: FormGroup;
  constructor(private planService: PlanService, private fb: FormBuilder) {
    this.createPlanForm = this.fb.group({
      planName: ['', [Validators.required, Validators.minLength(2)]],
      planType: ['', Validators.required],
      planPrice: [0.0, [Validators.required, Validators.pattern('^[0-9]+(\.{0,1})[0-9]*$')]],
      planDuration: [0, Validators.required],
      autoRenew: [false],
      planSessions: [1, [Validators.required, Validators.pattern('^[0-9]+(\.{0,1})[0-9]*$')]]
    })
  }

  setPlanType(type: string){
    this.createPlanForm.get('planType')?.patchValue(type)
  }

  toggleAutoRenew(){
    this.createPlanForm.get('autoRenew')?.patchValue(!this.createPlanForm.get('autoRenew')?.value)
  }

  setDuration(days: number){
    this.createPlanForm.get('planDuration')?.patchValue(days)
  }

}
