import { Component } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-member-stats',
  imports: [CommonModule],
  templateUrl: './member-stats.html',
  styleUrls: ['./member-stats.css'],
})
export class MemberStats {
  activeMembers = 0;
  subscribedMembers = 0;
  newMembers = 0;
  retention = 0;
  membersGrowth: any[] = [];
  chartPath = '';
chartDots: { x: number; y: number; value: number; label: string }[] = [];
  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.memberStats().subscribe({
      next: (res: any) => {
        this.activeMembers = res.activeMembers;
        this.subscribedMembers = res.subscribedMembers;
        this.newMembers = res.newMembers;
        this.membersGrowth = res.membersGrowth;
        // Calculate retention from available data
        const total = res.subscribedMembers + res.newMembers;
        this.retention = total > 0
          ? Math.round((res.subscribedMembers / total) * 100)
          : 0;

        this.buildChart(res.membersGrowth);
      },
      error: (err: any) => console.log('error', err)
    });
  }

  buildChart(data: any[]): void {
  if (!data || data.length === 0) return;

  // Group by month
  const grouped: { [key: string]: number } = {};
  data.forEach((d) => {
    const date = new Date(d.created_at);
    const key = date.toLocaleString('default', { month: 'short', year: 'numeric' }); // e.g. "Apr 2026"
    grouped[key] = (grouped[key] || 0) + 1;
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
}