import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { SideBar } from '../../shared/components/side-bar/side-bar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [SideBar, NgIf],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
  sidebarVisible = true;

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }
}
