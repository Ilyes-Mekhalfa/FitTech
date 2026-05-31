import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberService } from '../../core/services/member.service';
import { CommonModule } from '@angular/common';
import { MemberProfile } from '../../shared/components/member-profile/member-profile';
@Component({
  selector: 'app-member',
  imports: [CommonModule, MemberProfile],
  templateUrl: './member.html',
  styleUrl: './member.css',
})
export class Member implements OnInit {
  members: any[] = [];
  originalList: any;
  currentFilter: 'all' | 'active' | 'expired' | 'pending_payment' = 'all';
  selectMember: any;
  constructor(
    private router: Router,
    private memberService: MemberService,
  ) {}

  addMember() {
    this.router.navigate(['/member/add']);
  }

  ngOnInit() {
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
    this.memberService.deleteMember(member.id).subscribe({
      next: (res) => {
        console.log('user deleted successfully');
      },
      error: (err) => {
        console.log('error deleting member', err);
      },
    });
  }

  archiveMember(member: any) {
    this.memberService.archiveMember(member.fitapi_user.id).subscribe({
      next: (res: any) => {
        console.log('user archived successfully');
      },
      error: (err: any) => {
        console.log('error archiving user', err);
      },
    });
  }

  searchMember(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.members = this.originalList.filter(
      (e: any) =>
        e.fitapi_user.first_name.toLowerCase().includes(value.toLowerCase()) ||
        e.fitapi_user.last_name.toLowerCase().includes(value.toLowerCase()),
    );
  }
}
