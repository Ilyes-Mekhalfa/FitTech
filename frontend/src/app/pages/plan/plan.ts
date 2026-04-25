import { Component } from '@angular/core';
import { PlanService } from '../../core/services/plan.service';
@Component({
  selector: 'app-plan',
  imports: [],
  templateUrl: './plan.html',
  styleUrls: ['./plan.css'],
})
export class Plan {
  plans: any[] =[]

  constructor(private planService: PlanService){}

  ngOnInit(){
    this.planService.getAllPlans().subscribe({
      next: (res: any)=>{
        console.log(res);
        
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  filterPlans(){}
}
