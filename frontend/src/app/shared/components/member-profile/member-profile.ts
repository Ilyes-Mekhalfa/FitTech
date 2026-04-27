import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MemberService } from '../../../core/services/member.service';

@Component({
  selector: 'app-member-profile',
  imports: [],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile {
  @Input() member: any;
  @Output() close = new EventEmitter<void>();

  constructor(private memberService: MemberService) { }

  ngOnInit() {
    this.getMemberProfile();
  }

  getMemberProfile() {
    this.memberService.getMember(this.member).subscribe({
      next: (res: any) => {
        this.member = res;

      },
      error: (err: any) => {
        console.log(err);

      }
    })
  }

  closeProfile() {
    this.close.emit();
  }
}
