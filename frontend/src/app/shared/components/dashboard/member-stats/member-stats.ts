import { Component } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
@Component({
  selector: 'app-member-stats',
  imports: [],
  templateUrl: './member-stats.html',
  styleUrls: ['./member-stats.css'],
})
export class MemberStats {
  memberStats: any;

  constructor(private dashboardService: DashboardService){}

  ngOnInit(): void {
    this.dashboardService.memberStats().subscribe({
      next: (res)=>{
        this.memberStats =res;
      },
    error: (err: any) =>{
      console.log('error', err);
      
    }
    })
  }
}
