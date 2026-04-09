import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { SideBar } from '../../shared/components/side-bar/side-bar';
import { DashboardDTO} from './dto/admin-dashboard.dto';
import { DashboardService} from '../../core/services/dashboard.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SideBar, NgIf],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  sidebarVisible = true;
  dashboardData: DashboardDTO;
  constructor(private dashboardService: DashboardService,private router: Router){
  }
  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  ngOnInit(){
    this.dashboardService.dashboard().subscribe({
      next: (res: DashboardDTO)=>{
        this.dashboardData = res
      },
      error: (err:any)=>{
        console.log(err);
        
      }
    })
  }

  exportData(){
    this.dashboardService.exportData().subscribe({
      next: (res: any)=>{
        console.log(res);
        
      },
      error: (err: any)=>{
        console.log(err);
        
      }
    })
  }

  handleAddNewMember(){
    this.router.navigate(['/add-manager'])
  }
}
