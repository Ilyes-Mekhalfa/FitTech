import { Component, OnInit, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { WebsocketService } from '../../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-member-stats',
  imports: [CommonModule],
  templateUrl: './member-stats.html',
  styleUrls: ['./member-stats.css',]
})
export class MemberStats implements OnInit, OnDestroy {
  activeMembers = 0;
  subscribedMembers = 0;
  newMembers = 0;
  retention = 0;
  membersGrowth: any[] = [];
  chartPath = '';
  chartDots: { x: number; y: number; value: number; label: string }[] = [];

  // Manage real-time socket streams safely
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private dashboardService: DashboardService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit(): void {
    // 1. Initial HTTP pull for dashboard statistics metrics
    this.loadInitialStats();

    // 2. LISTEN: When membership registrations or profile updates change metrics live
    const statsUpdateSub = this.websocketService.onEvent('member_stats_updated').subscribe({
      next: (res: any) => {
        console.log('Real-time update: Member metrics updated!');
        this.processStatsResponse(res);
      },
      error: (err) => console.error('Member stats socket stream error:', err)
    });

    this.socketSubscriptions.add(statsUpdateSub);
  }

  loadInitialStats() {
    this.dashboardService.memberStats().subscribe({
      next: (res: any) => {
        this.processStatsResponse(res);
      },
      error: (err: any) => console.log('error', err)
    });
  }

  // Extracted processing logic to keep it uniform between HTTP and WS streams
  private processStatsResponse(res: any) {
    this.activeMembers = res.activeMembers;
    this.subscribedMembers = res.subscribedMembers;
    this.newMembers = res.newMembers;
    this.membersGrowth = res.membersGrowth;
    
    // Calculate retention from available data
    const total = res.subscribedMembers + res.newMembers;
    this.retention = total > 0 ? Math.round((res.subscribedMembers / total) * 100) : 0;

    // Recalculate SVG chart pathways instantly
    this.buildChart(res.membersGrowth);
  }

  buildChart(data: any[]): void {
    if (!data || data.length === 0) return;

    // Group by month
    const grouped: { [key: string]: number } = {};
    data.forEach((d) => {
      const date = new Date(d.created_at);
      const key = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g. "Apr 2026"
      groupingCalculation(grouped, key);
    });

    // Sort by date
    const sorted = Object.entries(grouped).sort((a, b) => {
      return new Date(a[0]).getTime() - new Date(b[0]).getTime();
    });

    const svgWidth = 380;
    const svgHeight = 160;
    const paddingX = 20;
    const paddingY = 20;

    const values = sorted.map(([, count]) => count);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal || 1;

    const points = sorted.map(([label, count], i) => {
      const x = paddingX + (i / Math.max(sorted.length - 1, 1)) * (svgWidth - paddingX * 2);
      const y = svgHeight - paddingY - ((count - minVal) / range) * (svgHeight - paddingY * 2);
      return { x, y, value: count, label };
    });

    this.chartDots = points;

    this.chartPath = points.reduce((path, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cpX = (prev.x + point.x) / 2;
      return path + ` C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
    }, '');
  }

  ngOnDestroy(): void {
    // 4. Clean up subscriptions to prevent memory leaks
    this.socketSubscriptions.unsubscribe();
  }
}

// Small descriptive helper out-of-line
function groupingCalculation(grouped: { [key: string]: number }, key: string) {
  grouped[key] = (grouped[key] || 0) + 1;
}