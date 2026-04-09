import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { SideBar } from '../../shared/components/side-bar/side-bar';
import { DashboardDTO} from './dto/admin-dashboard.dto';
import { AdminDashboardService} from '../../core/services/admin-dashboardService'
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SideBar, NgIf, DashboardDTO],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  sidebarVisible = true;
  dashboardData: DashboardDTO;
  constructor(private adminDashboardService: AdminDashboardService){}
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnInit(){
    this.adminDashboardService.getDashboardData().subscribe({
      next: (res: DashboardDTO)=>{
        this.dashboardData = res
      },
      error: (err:any)=>{
        console.log(err);
        
      }
    })
  }
}
