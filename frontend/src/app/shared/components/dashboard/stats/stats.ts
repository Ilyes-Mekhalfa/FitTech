import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { WebsocketService } from '../../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule], // Equipped to handle structural template bindings safely
  templateUrl: './stats.html',
  styleUrls: ['./stats.css'],
})
export class Stats implements OnInit, OnDestroy {
  dashboardData: any;

  // Track socket streams for explicit teardown on navigation
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private dashboardService: DashboardService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit() {
    // 1. Initial HTTP pull for main overview cards on load
    this.loadGeneralStats();
console.log('stats')
    // 2. LISTEN: Global facility metrics shift on the backend server
    const generalStatsSub = this.websocketService.onEvent('general_stats_updated').subscribe({
      next: (res: any) => {
        console.log('Real-time update: General dashboard overview updated!');
        this.dashboardData = res;
      },
      error: (err: any) => console.error('General stats socket error:', err)
    });

    this.socketSubscriptions.add(generalStatsSub);
  }

  loadGeneralStats() {
    this.dashboardService.generalStats().subscribe({
      next: (res: any) => {
        this.dashboardData = res;
      },
      error: (err: any) => {
        console.log('error', err);
      }
    });
  }

  ngOnDestroy(): void {
    // 3. Clear running background socket tasks safely
    this.socketSubscriptions.unsubscribe();
  }
}