import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlanService } from '../../core/services/plan.service';
import { WebsocketService } from '../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-plan',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './plan.html',
  styleUrls: ['./plan.css'],
})
export class Plan implements OnInit, OnDestroy {
  allPlans: any[] = [];
  plans: any[] = [];
  currentFilter: string = 'all';
  enableUpdate: boolean = false;
  selectedPlan: any = null;
  panelMode: 'view' | 'edit' = 'view';
  currentPage = 1;
  totalPageNumber: any;
  pagesArr: any;

  // Track socket streams
  private socketSubscriptions: Subscription = new Subscription();

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
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit() {
    // Initial fetch from database
    this.loadInitialPlans();

    // 4. Listen for real-time plan creations
    const addSub = this.websocketService.onEvent('plan_added').subscribe({
      next: (newPlan: any) => {
        console.log('Real-time update: plan added', newPlan);
        this.allPlans.push(newPlan);
        this.filterPlan(this.currentFilter);
        this.recalculatePagination();
      }
    });

    // 5. Listen for real-time plan modifications
    const updateSub = this.websocketService.onEvent('plan_updated').subscribe({
      next: (updatedPlan: any) => {
        console.log('Real-time update: plan modified', updatedPlan.id);
        
        // Update item inside original lists
        this.allPlans = this.allPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
        
        // Refresh visible active tracking arrays
        this.filterPlan(this.currentFilter);

        // If this admin is currently inspecting the modified plan details panel, update it live!
        if (this.selectedPlan?.id === updatedPlan.id && this.panelMode === 'view') {
          this.selectedPlan = updatedPlan;
        }
      }
    });

    // 6. Listen for real-time deletions
    const deleteSub = this.websocketService.onEvent('plan_deleted').subscribe({
      next: (data: { id: string }) => {
        console.log('Real-time update: plan deleted', data.id);
        this.allPlans = this.allPlans.filter((plan) => plan.id !== data.id);
        this.plans = this.plans.filter((plan) => plan.id !== data.id);
        
        if (this.selectedPlan?.id === data.id) {
          this.selectedPlan = null;
          this.panelMode = 'view';
        }
        this.recalculatePagination();
      }
    });

    // Add everything to teardown manager
    this.socketSubscriptions.add(addSub);
    this.socketSubscriptions.add(updateSub);
    this.socketSubscriptions.add(deleteSub);
  }

  loadInitialPlans() {
    this.planService.getAllPlans().subscribe({
      next: (res: any) => {
        this.allPlans = res;
        this.plans = [...this.allPlans];
        this.recalculatePagination();
      },
      error: (err) => console.log(err),
    });
  }

  recalculatePagination() {
    this.totalPageNumber = Math.ceil(this.plans.length / 10) || 1;
    this.pagesArr = Array(this.totalPageNumber).fill(0).map((_, i) => i + 1);
    if (this.currentPage > this.totalPageNumber) {
      this.currentPage = this.totalPageNumber;
    }
  }

  createNewPlan() {
    this.router.navigate(['plan/add']);
  }

  deletePlan(id: string) {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      this.planService.deletePlan(id).subscribe({
        next: () => console.log('Delete command handled by server'),
        error: (err: any) => console.log(err),
      });
    }
  }

  selectPlan(plan: any) {
    if (!this.selectedPlan) {
      this.selectedPlan = plan;
      this.panelMode = 'view';
    } else {
      this.selectedPlan = null;
    }
  }

  // Used if you have secondary save buttons or status changes
  updatePlan() {
    this.planService.updatePlan(this.selectedPlan.id, this.editPlanForm.value).subscribe({
      next: () => console.log('Update instruction received by backend'),
      error: (err: any) => console.log(err),
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
      next: () => {
        console.log('Edits pushed cleanly to API');
        this.panelMode = 'view';
        // Note: No manual arrays manipulation here. The websocket listener updates them cleanly for everyone.
      },
      error: (err: any) => console.log(err),
    });
  }

  SortPlans(e: any) {
    if (e.target.value === 'newest') {
      this.plans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      this.allPlans.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (e.target.value === 'price') {
      this.plans.sort((a, b) => b.price - a.price);
      this.allPlans.sort((a, b) => b.price - a.price);
    }
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
    this.recalculatePagination();
  }

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

  ngOnDestroy(): void {
    // 7. Cleanup subscriptions to prevent memory leaks
    this.socketSubscriptions.unsubscribe();
  }
}