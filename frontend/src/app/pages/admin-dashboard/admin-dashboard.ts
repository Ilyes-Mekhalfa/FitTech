import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveEnterance } from '../../shared/components/live-enterance/live-enterance';
import { DashboardDTO } from './dto/admin-dashboard.dto';
import { DashboardService } from '../../core/services/dashboard.service'
import { Router } from '@angular/router';
import { CoachStats} from '../../shared/components/dashboard/coach-stats/coach-stats'
import { MemberStats} from '../../shared/components/dashboard/member-stats/member-stats'
import { PlanStats} from '../../shared/components/dashboard/plan-stats/plan-stats'
import { Stats} from '../../shared/components/dashboard/stats/stats'
@Component({
  selector: 'app-admin-dashboard',
  imports: [LiveEnterance, CommonModule, CoachStats, MemberStats, PlanStats, Stats],
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  sidebarVisible = true;
  dashboardData: DashboardDTO;
  constructor(private dashboardService: DashboardService, private router: Router) {
    this.dashboardData = {
      annexName: '',
      totalMembers: 0,
      activeClasses: 0,
      liveCapacity: 0,
      monthlyRevenue: 0,
      revenueTrend: [],
      memberMix: {
        premium: 0,
        standard: 0,
        vip: 0,
      },
      trending_up: 0,
    }
  }
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnInit() {
    // this.dashboardService.dashboard().subscribe({
    //   next: (res: DashboardDTO) => {
    //     this.dashboardData = res
    //   },
    //   error: (err: any) => {
    //     console.log(err);

    //   }
    // })
  }

  exportData() {
    // this.dashboardService.exportData().subscribe({
    //   next: (res: any) => {
    //     console.log(res);

    //   },
    //   error: (err: any) => {
    //     console.log(err);

    //   }
    // })
  }

  getDailyToken() {
    this.router.navigate(['/dailyToken'])
  }
}
