import { Component } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-live-enterance',
  imports: [CommonModule],
  templateUrl: './live-enterance.html',
  styleUrl: './live-enterance.css',
})
export class LiveEnterance {

  users: any;
  constructor(private dashboardService: DashboardService){}

  ngOnInit(): void {
    this.dashboardService.liveEnterance().subscribe({
      next: (res: any)=>{
        this.users = res.users;
      }
    })
  }
}
