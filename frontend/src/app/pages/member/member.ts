import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../../core/services/member.service';
import { WebsocketService } from '../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import { MemberProfile } from '../../shared/components/member-profile/member-profile';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-member',
  imports: [CommonModule, MemberProfile],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit, OnDestroy {
  members: any[] = [];
  originalList: any[] = [];
  currentFilter: 'all' | 'active' | 'expired' | 'pending_payment' = 'all';
  selectMember: any;

  // Track socket subscriptions for clean tear-down
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private memberService: MemberService,
    private websocketService: WebsocketService // 3. Inject the WebSocket service
  ) {}

  ngOnInit() {
    // Load initial member data via HTTP
    this.loadInitialMembers();

    // 4. Listen for real-time deletions / archivals
    const memberDeleteSub = this.websocketService.onEvent('member_deleted').subscribe({
      next: (data: { id: string }) => {
        console.log('Real-time update: removing member', data.id);
        
        // Remove from both lists to keep search and filtering accurate
        // Note: checking against fitapi_user.id or top-level id depending on how your object is built
        this.members = this.members.filter((m: any) => m.fitapi_user?.id !== data.id && m.id !== data.id);
        this.originalList = this.originalList.filter((m: any) => m.fitapi_user?.id !== data.id && m.id !== data.id);
        
        // Close profile card if the open member was the one who got removed
        if (this.selectMember?.fitapi_user?.id === data.id || this.selectMember?.id === data.id) {
          this.closeProfile();
        }
      },
      error: (err) => console.error('Member socket error:', err)
    });

    this.socketSubscriptions.add(memberDeleteSub);
  }

  loadInitialMembers() {
    this.memberService.getAllMembers().subscribe({
      next: (res: any) => {
        console.log(res);
        this.originalList = res;
        this.members = res;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addMember() {
    this.router.navigate(['/member/add']);
  }

  applyFilter(filter: any) {
    this.currentFilter = filter;
    if (filter == 'all') {
      this.members = this.originalList;
      return;
    }
    this.members = this.originalList.filter((e: any) => {
      const subs = e.fitapi_membresubscription ?? [];
      const stat = subs.length > 0 ? subs[subs.length - 1].status : 'expired';

      return stat == filter;
    });
  }

  selectedMember(member: any) {
    if (!this.selectMember) {
      this.selectMember = member;
    } else {
      this.selectMember = null;
    }
  }

  closeProfile() {
    this.selectMember = null;
  }

  deleteMember(member: any) {
    if (confirm('Are you sure you want to delete this member?')) {
      this.memberService.deleteMember(member.id).subscribe({
        next: (res) => {
          console.log('Delete command processed by backend successfully', res);
        },
        error: (err) => {
          console.log('error deleting member', err);
        },
      });
    }
  }

  archiveMember(member: any) {
    if (confirm('Are you sure you want to archive this member?')) {
      this.memberService.archiveMember(member.fitapi_user.id).subscribe({
        next: (res: any) => {
          console.log('Archive request handled by backend');
          // Notice: No manual local filtering here anymore! The WebSocket event takes care of it for everyone.
        },
        error: (err: any) => {
          console.log('error archiving user', err);
        },
      });
    }
  }

  searchMember(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.members = this.originalList.filter(
      (e: any) =>
        e.fitapi_user.first_name.toLowerCase().includes(value.toLowerCase()) ||
        e.fitapi_user.last_name.toLowerCase().includes(value.toLowerCase()),
    );
  }

  ngOnDestroy(): void {
    // 5. Cleanup to prevent memory leaks when navigating away
    this.socketSubscriptions.unsubscribe();
  }
}