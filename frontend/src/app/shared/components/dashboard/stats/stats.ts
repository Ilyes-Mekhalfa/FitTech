import { Component } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.html',
  styleUrls: ['./stats.css'],
})
export class Stats {
  dashboardData: any;

  constructor(private dashboardService: DashboardService){}

  ngOnInit(){
    this.dashboardService.generalStats().subscribe({
      next: (res: any)=>{
        this.dashboardData = res;
      },
      error: (err: any)=>{
        console.log('error', err);
        
      }
    })
  }
}
