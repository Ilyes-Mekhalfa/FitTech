import { Component } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
@Component({
  selector: 'app-coach-stats',
  standalone: true,
  templateUrl: './coach-stats.html',
  styleUrls: ['./coach-stats.css']
})
export class CoachStats {
  coachStats: any;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.coachStats().subscribe({
      next: (data: any) => {
        this.coachStats = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
