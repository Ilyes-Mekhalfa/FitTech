import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { WebsocketService } from '../../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-coach-stats',
  standalone: true,
  imports: [CommonModule], // Added in case your template uses structure directives
  templateUrl: './coach-stats.html',
  styleUrls: ['./coach-stats.css']
})
export class CoachStats implements OnInit, OnDestroy {
  coachStats: any;

  // Track socket streams for safe component lifecycle teardown
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private dashboardService: DashboardService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit(): void {
    // 1. Fetch initial statistics report data via HTTP on load
    this.loadInitialStats();

    // 2. LISTEN: If sessions or records alter coach data metrics on the server side
    const statsUpdateSub = this.websocketService.onEvent('coach_stats_updated').subscribe({
      next: (updatedStats: any) => {
        console.log('Real-time update: Coach statistics refreshed!');
        this.coachStats = updatedStats;
      },
      error: (err) => console.error('Coach stats socket stream error:', err)
    });

    this.socketSubscriptions.add(statsUpdateSub);
  }

  loadInitialStats() {
    this.dashboardService.coachStats().subscribe({
      next: (data: any) => {
        this.coachStats = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  ngOnDestroy(): void {
    // 3. Unsubscribe to avoid running streams in the background
    this.socketSubscriptions.unsubscribe();
  }
}