import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoachService } from '../../core/services/coach.service';
import { WebsocketService } from '../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoachProfile } from '../../shared/components/coach-profile/coach-profile';
import { Subscription } from 'rxjs'; // 2. Import Subscription for cleanups

@Component({
  selector: 'app-coach',
  imports: [CommonModule, CoachProfile],
  templateUrl: './coach.html',
  styleUrl: './coach.css',
})
export class Coach implements OnInit, OnDestroy {
  approvalCount: number = 0;
  coachs: any[] = [];
  originalList: any[] = [];
  pendingRequests: any[] = [];
  selectedCoach: any;
  currentFilter: 'all' | 'FITNESS' | 'MMA' | 'BODY BUILDER' = 'all';

  // Keep track of subscriptions to prevent memory leaks
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private coachService: CoachService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit(): void {
    // Load initial data via standard HTTP GET
    this.loadInitialCoaches();

    // 4. Listen for real-time deletions / archivals
    const deleteSub = this.websocketService.onEvent('coach_deleted').subscribe({
      next: (data: { id: string }) => {
        console.log('Real-time update: removing coach', data.id);
        
        // Remove from both lists so searches/filters remain accurate
        this.coachs = this.coachs.filter((c: any) => c.id !== data.id);
        this.originalList = this.originalList.filter((c: any) => c.id !== data.id);
        
        // Also remove from pending requests just in case it was a rejection
        this.pendingRequests = this.pendingRequests.filter((req: any) => req.fitapi_coach?.id !== data.id);

        // Close details drawer if the active coach profile was the one deleted
        if (this.selectedCoach?.id === data.id) {
          this.closeProfile();
        }
      }
    });

    // 5. Listen for real-time approvals
    const approveSub = this.websocketService.onEvent('coach_approved').subscribe({
      next: (data: { id: string, approvedCoach: any }) => {
        console.log('Real-time update: coach approved', data.id);
        
        // Remove from pending list
        this.pendingRequests = this.pendingRequests.filter((req: any) => req.fitapi_coach?.id !== data.id);
        
        // Add to active lists if not already present
        const exists = this.originalList.some((c: any) => c.id === data.id);
        if (!exists && data.approvedCoach) {
          this.originalList.push(data.approvedCoach);
          this.filterCoach(this.currentFilter); // Refresh current filter view
        }
      }
    });

    // Save subscriptions
    this.socketSubscriptions.add(deleteSub);
    this.socketSubscriptions.add(approveSub);
  }

  loadInitialCoaches() {
    this.coachService.getAllCoaches().subscribe({
      next: (res: any) => {
        console.log(res);
        this.coachs = res.coaches;
        this.originalList = res.coaches;
        this.pendingRequests = res.pendingRequests;
      },
      error: (err) => console.log(err),
    });
  }

  addCoach() {
    this.router.navigate(['coach/add']);
  }

  selectCoach(coach: any) {
    this.selectedCoach = coach;
  }

  deleteCoach(coach: any) {
    if (confirm('Are you sure you want to delete this coach?')) {
      this.coachService.deleteCoach(coach.id).subscribe({
        next: () => console.log('Delete command processed by backend'),
        error: (err) => console.log('error deleting coach', err),
      });
    }
  }

  archiveCoach(coach: any) {
    if (confirm('Are you sure you want to archive this coach?')) {
      this.coachService.archiveCoach(coach.id).subscribe({
        next: () => console.log('Archive command processed by backend'),
        error: (err: any) => console.log('error archiving coach', err),
      });
    }
  }

  approveApproval(req: any) {
    this.coachService.updateCoach(req.fitapi_coach?.id, { is_active: true }).subscribe({
      next: () => console.log('Approval command processed by backend'),
      error: (err) => console.log(err),
    });
  }

  rejectApproval(req: any) {
    if (confirm('Hitting this button will delete the coach permanently')) {
      this.coachService.deleteCoach(req.fitapi_coach?.id).subscribe({
        next: () => console.log('Rejection delete command processed by backend'),
        error: (err) => console.log('error deleting coach', err),
      });
    }
  }

  searchCoach(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.coachs = this.originalList.filter(
      (e: any) =>
        e.first_name.toLowerCase().includes(value.toLowerCase()) ||
        e.last_name.toLowerCase().includes(value.toLowerCase()),
    );
  }

  filterCoach(filter: any) {
    this.currentFilter = filter;    
    if (filter == 'all') {
      this.coachs = this.originalList;
    } else {
      this.coachs = this.originalList.filter((e: any) =>
        e.fitapi_coach?.specialties?.toLowerCase().includes(filter.toLowerCase())
      );
    }
  }

  closeProfile() {
    this.selectedCoach = null;
  }

  ngOnDestroy(): void {
    // 6. Clean up everything when the component dies to prevent memory leaks
    this.socketSubscriptions.unsubscribe();
  }
}