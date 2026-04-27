import { Component } from '@angular/core';
import { PlanService } from '../../core/services/plan.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-plan',
  imports: [CommonModule],
  templateUrl: './plan.html',
  styleUrls: ['./plan.css'],
})
export class Plan {
  plans: any[] =[]

  constructor(private planService: PlanService, private router: Router){}

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

  createNewPlan(){
    this.router.navigate(['plan/add'])
  }
}
