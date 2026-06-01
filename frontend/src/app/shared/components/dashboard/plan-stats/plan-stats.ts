import { Component } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service'
@Component({
  selector: 'app-plan-stats',
  imports: [],
  templateUrl: './plan-stats.html',
  styleUrls: ['./plan-stats.css'],
})
export class PlanStats {
  planStats: any;
  constructor(private dashboardService: DashboardService){}


ngOnInit(): void {
  this.dashboardService.planStats().subscribe({
    next: (res)=>{
      console.log(res);
      this.planStats = res;
    },
    error: (err: any) =>{
      console.log('error', err);
      
    }
  })
}
}
