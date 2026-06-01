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
  allPlans: any[] = [];
  plans: any[] = [];
  currentFilter: string = 'all';
  enableUpdate: boolean = false;
  selectedPlan: any = null;
  panelMode: 'view' | 'edit' = 'view';
  currentPage = 1;
  totalPageNumber: any;
  pagesArr: any;

  editPlanForm = new FormGroup({
    name: new FormControl(''),
    type: new FormControl('monthly'),
    price: new FormControl(0),
    sessions_count: new FormControl(0),
    duration_days: new FormControl(0),
    auto_renew: new FormControl(false),
  });
  constructor(
    private planService: PlanService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.planService.getAllPlans().subscribe({
      next: (res: any) => {
        this.allPlans = res;
        this.plans = [...this.allPlans];
        this.totalPageNumber = Math.ceil(res.length / 10);
        this.pagesArr = Array(this.totalPageNumber)
          .fill(0)
          .map((_, i) => i + 1);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  //plan operations
  createNewPlan() {
    this.router.navigate(['plan/add']);
  }

  deletePlan(id: string) {
    this.planService.deletePlan(id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.allPlans = this.allPlans.filter((plan) => plan.id !== id);
        this.plans = this.plans.filter((plan) => plan.id !== id); //for deleting the plan from the list when deleted in the database
        this.selectedPlan = null;
        this.panelMode = 'view';
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  selectPlan(plan: any) {
    if (!this.selectedPlan) {
      this.selectedPlan = plan;
      this.panelMode = 'view';
    } else {
      this.selectedPlan = null;
    }
  }

  updatePlan() {
    this.planService.updatePlan(this.selectedPlan.id, this.editPlanForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.selectedPlan = res;
        this.panelMode = 'view';
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  switchToEdit() {
    this.panelMode = 'edit';
    this.editPlanForm.patchValue({
      name: this.selectedPlan.name,
      type: this.selectedPlan.type,
      price: this.selectedPlan.price,
      sessions_count: this.selectedPlan.sessions_count,
      duration_days: this.selectedPlan.duration_days,
      auto_renew: this.selectedPlan.auto_renew,
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
        const index = this.plans.findIndex((p) => p.id === this.selectedPlan.id);
        if (index !== -1) {
          this.plans[index] = { ...this.plans[index], ...this.editPlanForm.value };
        }
        const allIndex = this.allPlans.findIndex((p) => p.id === this.selectedPlan.id);
        if (allIndex !== -1) {
          this.allPlans[allIndex] = { ...this.allPlans[allIndex], ...this.editPlanForm.value };
        }
        this.selectedPlan = { ...this.selectedPlan, ...this.editPlanForm.value };
        this.panelMode = 'view';
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  //filtering operations
  SortPlans(e: any) {
    if (e.target.value === 'newest') {
      this.plans.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      this.allPlans.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (e.target.value === 'price') {
      this.plans.sort((a, b) => b.price - a.price);
      this.allPlans.sort((a, b) => b.price - a.price);
    } //till we see what to do with this
    // }else if(e.target.value === 'popularity'){
    //   this.plans.sort((a, b) => b.subscribers - a.subscribers);
    // }
  }

  filterPlan(type: string) {
    this.currentFilter = type;
    if (type === 'all') {
      this.plans = [...this.allPlans];
    } else if (type === 'weekly') {
      this.plans = this.allPlans.filter((plan) => plan.duration_days === 7);
    } else if (type === 'monthly') {
      this.plans = this.allPlans.filter((plan) => plan.duration_days === 30);
    } else if (type === 'yearly') {
      this.plans = this.allPlans.filter((plan) => plan.duration_days === 365);
    }
  }

  //pagination

  paginatedPlans() {
    const start = (this.currentPage - 1) * 10;
    return this.plans.slice(start, start + 10);
  }
  nextPage() {
    this.goToPage(this.currentPage + 1);
  }
  previousPage() {
    this.goToPage(this.currentPage - 1);
  }

  goToPage(i: any) {
    if (i < 1 || i > this.totalPageNumber) return;
    this.currentPage = i;
  }
}
