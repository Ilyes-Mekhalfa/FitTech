import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MemberService } from '../../../core/services/member.service';

@Component({
  selector: 'app-member-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile {
  @Input() member: any;
  @Output() close = new EventEmitter<void>();

  editMode = false;
  editFormData: any = {};
  subscriptionFormData: any = {
    plan: '',
    sessions: 1,
    paymentMethod: 'credit-card'
  };
  availablePlans: any[] = [];

  constructor(private memberService: MemberService) { }

  ngOnInit() {
    this.getMemberProfile();
    this.getAvailablePlans();
  }

  getMemberProfile() {
    this.memberService.getMember(this.member).subscribe({
      next: (res: any) => {
        this.member = res;
        this.initEditForm();
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  getAvailablePlans() {
    this.memberService.getAvailablePlans().subscribe({
      next: (res: any) => {
        this.availablePlans = res;
        if (this.availablePlans.length > 0) {
          this.subscriptionFormData.plan = this.availablePlans[0].id;
        }
      },
      error: (err: any) => {
        console.log('Error fetching plans:', err);
        this.availablePlans = [];
      }
    });
  }

  initEditForm() {
    this.editFormData = {
      first_name: this.member?.fitapi_user?.first_name,
      last_name: this.member?.fitapi_user?.last_name,
      email: this.member?.fitapi_user?.email,
    };
    
    this.subscriptionFormData = {
      plan: this.member?.subscription_plan_id || '',
      sessions: this.member?.subscription_sessions || 1,
      paymentMethod: this.member?.payment_method || 'credit-card'
    };
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.initEditForm();
    }
  }

  saveProfile() {
    const updateData = {
      first_name: this.editFormData.first_name,
      last_name: this.editFormData.last_name,
      email: this.editFormData.email,
    };

    this.memberService.updateMember(this.member.id, updateData).subscribe({
      next: (res: any) => {
        this.member.fitapi_user = {
          ...this.member.fitapi_user,
          ...updateData
        };
        console.log('Profile updated successfully');
      },
      error: (err: any) => {
        console.log('Error updating member:', err);
      }
    });
  }

  updateSubscription() {
    // const subscriptionData = {
    //   plan_id: this.subscriptionFormData.plan,
    //   sessions: this.subscriptionFormData.sessions,
    //   payment_method: this.subscriptionFormData.paymentMethod,
    // };

    // this.memberService.updateSubscription(this.member.id, subscriptionData).subscribe({
    //   next: (res: any) => {
    //     this.member.subscription_plan_id = subscriptionData.plan_id;
    //     this.member.subscription_sessions = subscriptionData.sessions;
    //     this.member.payment_method = subscriptionData.payment_method;
    //     this.member.subscription_status = 'active';
    //     this.member.subscription_end_date = res.subscription_end_date;
    //     console.log('Subscription updated successfully');
    //   },
    //   error: (err: any) => {
    //     console.log('Error updating subscription:', err);
    //   }
    // });
  }

  closeProfile() {
    this.close.emit();
  }
}
