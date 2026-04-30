import { Component } from '@angular/core';
import { PlanService } from '../../core/services/plan.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-plan',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './plan.html',
  styleUrls: ['./plan.css'],
})
export class Plan {
  plans: any[] =[]
  enableUpdate: boolean = false;
  selectedPlan: any = null;
  panelMode: 'view' | 'edit' = 'view';

  editPlanForm = new FormGroup({
    name: new FormControl(''),
    type: new FormControl('monthly'),
    price: new FormControl(0),
    sessions_count: new FormControl(0),
    duration_days: new FormControl(0),
    auto_renew: new FormControl(false)
  });
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
        this.plans = this.plans.filter(plan => plan.id !== id); //for deleting the plan from the list when deleted in the database
        this.selectedPlan = null;
        this.panelMode = 'view';
      },
      error: (err: any)=>{
        console.log(err);  
      }
    })
  }
  selectPlan(plan: any){
    this.selectedPlan = plan;
    this.panelMode = 'view';
  }

  updatePlan(){
    this.planService.updatePlan(this.selectedPlan.id, this.editPlanForm.value ).subscribe({
      next: (res: any)=>{
        console.log(res);
        this.selectedPlan = res;
        this.panelMode = 'view';
      },
      error: (err: any)=>{
        console.log(err);
        
      }
    })
  }

  switchToEdit() {
    this.panelMode = 'edit';
    this.editPlanForm.patchValue({
      name: this.selectedPlan.name,
      type: this.selectedPlan.type,
      price: this.selectedPlan.price,
      sessions_count: this.selectedPlan.sessions_count,
      duration_days: this.selectedPlan.duration_days,
      auto_renew: this.selectedPlan.auto_renew
    });
  }

  setEditType(type: string) {
    this.editPlanForm.patchValue({ type });
  }

  toggleEditAutoRenew() {
    const current = this.editPlanForm.get('auto_renew')?.value;
    this.editPlanForm.patchValue({ auto_renew: !current });
  }

  saveEdit() {
    this.planService.updatePlan(this.selectedPlan.id, this.editPlanForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        const index = this.plans.findIndex(p => p.id === this.selectedPlan.id);
        if (index !== -1) {
          this.plans[index] = { ...this.plans[index], ...this.editPlanForm.value };
        }
        this.selectedPlan = { ...this.selectedPlan, ...this.editPlanForm.value };
        this.panelMode = 'view';
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
