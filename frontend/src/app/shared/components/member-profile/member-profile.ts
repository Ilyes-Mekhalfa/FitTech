import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberService } from '../../../core/services/member.service';
import { PlanService } from '../../../core/services/plan.service';

@Component({
  selector: 'app-member-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile {
  @Input() member: any;
  @Output() close = new EventEmitter<void>();

  editMode = false;
  editFormData: FormGroup;
  subscriptionFormData: FormGroup;
  availablePlans: any[] = [];

  constructor(private memberService: MemberService, private planService: PlanService, private fb: FormBuilder) {
    this.editFormData = this.fb.group({
      first_name: [this.member?.fitapi_user?.first_name],
      last_name: [''],
      email: [''],
    });

    this.subscriptionFormData = this.fb.group({
      plan: [''],
      sessions: [1],
      paymentMethod: ['']
    })
   }

  ngOnInit() {
    this.getAvailablePlans();
  }

  

  toggleEditMode() {
    this.editMode = !this.editMode;
    if(this.editMode){
      this.editFormData.patchValue({
        first_name: this.member?.fitapi_user?.first_name,
        last_name: this.member?.fitapi_user?.last_name,
        email: this.member?.fitapi_user?.email
      })
    }
  }

  getAvailablePlans() {
    this.planService.getAllPlans().subscribe({
      next: (res: any)=>{
        this.availablePlans = res
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }

  saveProfile() {
    this.memberService.updateMember(this.member.id, this.editFormData).subscribe({
      next: (res: any) => {
        this.member.fitapi_user = {
          ...this.member.fitapi_user,
          ...this.editFormData
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
