import { Component, OnInit, OnDestroy } from '@angular/core';
import { LandingService } from '../../../../core/services/landing.service';
import { WebsocketService } from '../../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-plans',
  imports: [CommonModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans implements OnInit, OnDestroy {
  allPlans: any[] = [];
  filteredPlans: any[] = [];
  activeFilter: 'daily' | 'monthly' | 'quarterly' | 'yearly' = 'monthly';

  // Manage all real-time streams safely
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private landingService: LandingService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit() {
    // 1. Initial HTTP pull for membership plans
    this.loadLandingPlans();

    // 2. LISTEN: Real-time additions of new packages
    const addSub = this.websocketService.onEvent('plan_added').subscribe({
      next: (newPlan: any) => {
        console.log('Real-time update (Landing Plans): New plan added!', newPlan);
        this.allPlans.push(newPlan);
        this.setPlanFilter(this.activeFilter); // Refresh current visual view
      }
    });

    // 3. LISTEN: Real-time price edits or change adjustments
    const updateSub = this.websocketService.onEvent('plan_updated').subscribe({
      next: (updatedPlan: any) => {
        console.log('Real-time update (Landing Plans): Plan modified!', updatedPlan.id);
        this.allPlans = this.allPlans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
        this.setPlanFilter(this.activeFilter); // Refresh view instantly
      }
    });

    // 4. LISTEN: Real-time removals of old packages
    const deleteSub = this.websocketService.onEvent('plan_deleted').subscribe({
      next: (data: { id: string }) => {
        console.log('Real-time update (Landing Plans): Plan removed', data.id);
        this.allPlans = this.allPlans.filter(p => p.id !== data.id);
        this.setPlanFilter(this.activeFilter); // Sync current filtered UI array
      }
    });

    this.socketSubscriptions.add(addSub);
    this.socketSubscriptions.add(updateSub);
    this.socketSubscriptions.add(deleteSub);
  }

  loadLandingPlans() {
    this.landingService.getPlansData().subscribe({
      next: (res: any) => {
        this.allPlans = res;
        this.setPlanFilter('monthly');
      },
      error: (err) => {
        console.log('error fetching plans data', err);
      }
    });
  }

  setPlanFilter(filter: 'daily' | 'monthly' | 'quarterly' | 'yearly') {
    this.activeFilter = filter;
    this.filteredPlans = this.allPlans.filter((e) => e.type == filter);
  }

  ngOnDestroy(): void {
    // 5. Clean up real-time handlers to ensure zero memory leaks
    this.socketSubscriptions.unsubscribe();
  }
}