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
  enableUpdate: boolean = false;
  plan: any = {};
  constructor(private planService: PlanService, private router: Router){}

  ngOnInit(){
    this.planService.getAllPlans().subscribe({
      next: (res: any)=>{
        this.plans = res
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

  deletePlan(id: string){
    this.planService.deletePlan(id).subscribe({
      next: (res: any)=>{
        console.log(res);
        
      },
      error: (err: any)=>{
        console.log(err);  
      }
    })
  }
  selectPlan(plan: any){
    this.plan = plan;
    this.enableUpdate = !this.enableUpdate;
  }

  updatePlan(){
    this.planService.updatePlan(this.plan.id,this.plan ).subscribe({
      next: (res: any)=>{
        console.log(res);
        
      },
      error: (err: any)=>{
        console.log(err);
        
      }
    })
  }
}
