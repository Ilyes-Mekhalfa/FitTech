import { Component, OnInit, OnDestroy } from '@angular/core';
import { LandingService } from '../../../../core/services/landing.service';
import { WebsocketService } from '../../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-coaches',
  imports: [CommonModule],
  templateUrl: './coaches.html',
  styleUrl: './coaches.css',
})
export class Coaches implements OnInit, OnDestroy {
  coaches: any[] = [];

  // Track socket streams for safe unsubscription
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private landingService: LandingService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit(): void {
    // 1. Fetch initial public coach profiles via HTTP
    this.loadLandingCoaches();

    // 2. LISTEN: If an admin deletes or archives a coach, remove them live
    const deleteSub = this.websocketService.onEvent('coach_deleted').subscribe({
      next: (data: { id: string }) => {
        console.log('Real-time update (Landing): Removing coach', data.id);
        this.coaches = this.coaches.filter((c: any) => c.id !== data.id);
      },
      error: (err) => console.error('Landing coach delete socket error:', err)
    });

    // 3. LISTEN: If a new coach gets approved, append them to the page live
    const approveSub = this.websocketService.onEvent('coach_approved').subscribe({
      next: (data: { id: string, approvedCoach: any }) => {
        console.log('Real-time update (Landing): New coach approved!', data.id);
        
        // Prevent adding duplicates
        const exists = this.coaches.some((c: any) => c.id === data.id);
        if (!exists && data.approvedCoach) {
          this.coaches.push(data.approvedCoach);
        }
      },
      error: (err) => console.error('Landing coach approval socket error:', err)
    });

    this.socketSubscriptions.add(deleteSub);
    this.socketSubscriptions.add(approveSub);
  }

  loadLandingCoaches() {
    this.landingService.getCoachData().subscribe({
      next: (res: any) => {
        console.log(res);
        this.coaches = Array.isArray(res) ? res : res.coaches || [];
      },
      error: (err: any) => {
        console.log('error fetching coaches data', err);
      }
    });
  }

  ngOnDestroy(): void {
    // 4. Disconnect streams when navigating away from the landing page view
    this.socketSubscriptions.unsubscribe();
  }
}