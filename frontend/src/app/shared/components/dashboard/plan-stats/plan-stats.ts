import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { WebsocketService } from '../../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-plan-stats',
  imports: [CommonModule],
  templateUrl: './plan-stats.html',
  styleUrls: ['./plan-stats.css'],
})
export class PlanStats implements OnInit, OnDestroy {
  plans: any[] = [];
  machines: any[] = [];
  plansTotal: number = 0;
  machinesTotal: number = 0;
  circumference = 2 * Math.PI * 45; // ≈ 282.74

  // Manage all real-time streams safely
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private dashboardService: DashboardService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit(): void {
    // 1. Initial HTTP fetch for current stats
    this.loadInitialStats();

    // 2. LISTEN: When plan subscriptions or machine states alter metrics live
    const statsUpdateSub = this.websocketService.onEvent('plan_stats_updated').subscribe({
      next: (res: any) => {
        console.log('Real-time update: Plan and machine stats refreshed!');
        this.processStatsData(res);
      },
      error: (err) => console.error('Plan stats socket stream error:', err)
    });

    this.socketSubscriptions.add(statsUpdateSub);
  }

  loadInitialStats() {
    this.dashboardService.planStats().subscribe({
      next: (res: any) => {
        this.processStatsData(res);
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

  // Centralized data processing to handle both HTTP responses and WebSocket events uniformly
  private processStatsData(res: any) {
    this.plans = res.plans || [];
    this.machines = res.machines || [];
    
    // Recalculate totals so custom SVG calculations can render correctly
    this.plansTotal = this.plans.reduce((sum: number, p: any) => sum + p.count, 0) || 1; // Prevent division by zero
    this.machinesTotal = this.machines.reduce((sum: number, m: any) => sum + m.count, 0) || 1;
  }

  // Returns "arc remainder" for stroke-dasharray
  getArc(count: number, total: number): string {
    const activeTotal = total || this.plansTotal;
    const arc = (count / activeTotal) * this.circumference;
    return `${arc.toFixed(1)} ${this.circumference.toFixed(1)}`;
  }

  // Returns cumulative offset for stroke-dashoffset
  getOffset(index: number): string {
    const preceding = this.plans.slice(0, index).reduce((sum, p) => sum + p.count, 0);
    const offset = -((preceding / this.plansTotal) * this.circumference);
    return offset.toFixed(1);
  }

  getMachineArc(count: number): string {
    const arc = (count / this.machinesTotal) * this.circumference;
    return `${arc.toFixed(1)} ${this.circumference.toFixed(1)}`;
  }

  getMachineOffset(index: number): string {
    const preceding = this.machines.slice(0, index).reduce((sum: number, m: any) => sum + m.count, 0);
    const offset = -((preceding / this.machinesTotal) * this.circumference);
    return offset.toFixed(1);
  }

  ngOnDestroy(): void {
    // 4. Clean up subscriptions to prevent memory leaks
    this.socketSubscriptions.unsubscribe();
  }
}