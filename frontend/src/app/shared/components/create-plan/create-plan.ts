import { Component } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CanComponentDeactivate } from '../../../core/guards/can-deactivate.guard';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-plan',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-plan.html',
  styleUrls: ['./create-plan.css'],
})
export class CreatePlan implements CanComponentDeactivate {

  createPlanForm: FormGroup;
  constructor(
    private planService: PlanService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createPlanForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      type: ['', Validators.required],
      price: [0.0, [Validators.required, Validators.pattern('^[0-9]+(\.{0,1})[0-9]*$')]],
      duration_days: [0, Validators.required],
      auto_renew: [false],
      sessions_count: [1, [Validators.required, Validators.pattern('^[0-9]+(\.{0,1})[0-9]*$')]]
    })
  }

  setPlanType(type: string) {
    this.createPlanForm.get('type')?.patchValue(type)
  }

  toggleAutoRenew() {
    this.createPlanForm.get('auto_renew')?.patchValue(!this.createPlanForm.get('auto_renew')?.value)
  }

  setDuration(days: number) {
    this.createPlanForm.get('duration_days')?.patchValue(days)
  }

  get completionPct(): number {
    const fields = ['name', 'type', 'price', 'sessions_count', 'duration_days'];
    const filled = fields.filter(f => {
      const v = this.createPlanForm.get(f)?.value;
      return v !== null && v !== '' && v !== 0;
    }).length;
    return Math.round((filled / fields.length) * 100);
  }

  onSubmit() {
    if (this.createPlanForm.invalid) {
      throw Error("the create plan form is invalid please check your infromations")
    }

    this.planService.createPlan(this.createPlanForm.value).subscribe({
      next: (res: any) => {
        console.log(res);

      },
      error: (err: any) => {
        console.log(err);

      }
    })
  }

  canDeactivate(): boolean {
    if (this.createPlanForm.dirty) {
      return confirm('All unsaved changes will be lost. Are you sure you want to leave?');
    }
    return true
  }
}
