import { Component } from '@angular/core';
import { PlanService } from '../../../core/services/plan.service';

@Component({
  selector: 'app-create-plan',
  imports: [],
  templateUrl: './create-plan.html',
  styleUrl: './create-plan.css',
})
export class CreatePlan {

  constructor(private planService: PlanService){}
}
