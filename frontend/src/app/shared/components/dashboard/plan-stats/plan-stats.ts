import { Component } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plan-stats',
  imports: [CommonModule],
  templateUrl: './plan-stats.html',
  styleUrls: ['./plan-stats.css'],
})
export class PlanStats {
  plans: any[] = [];
  machines: any[] = [];
  plansTotal: number = 0;
  machinesTotal: number = 0;
  circumference = 2 * Math.PI * 45; // ≈ 283

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.planStats().subscribe({
      next: (res: any) => {
        this.plans = res.plans;
        this.machines = res.machines;
        this.plansTotal = res.plans.reduce((sum: number, p: any) => sum + p.count, 0);
        this.machinesTotal = res.machines.reduce((sum: number, m: any) => sum + m.count, 0);
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

  // Returns "arc remainder" for stroke-dasharray
  getArc(count: number, total: number): string {
    const arc = (count / total) * this.circumference;
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
}