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
  originalFormData: any = {};

  constructor(private memberService: MemberService, private planService: PlanService, private fb: FormBuilder) {
    this.editFormData = this.fb.group({
      first_name: [''],
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
      });
      this.originalFormData = { ...this.editFormData.value };
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

  private getChangedFields(): any {
    const changedFields: any = {};
    const formControls = this.editFormData.controls;

    Object.keys(formControls).forEach(key => {
      const control = formControls[key];
      const currentValue = control.value;
      const originalValue = this.originalFormData[key];

      // Check if field is dirty AND value is different from original
      if (control.dirty && currentValue !== originalValue) {
        changedFields[key] = currentValue;
      }
    });

    return changedFields;
  }

  saveProfile() {
    const changedData = this.getChangedFields();

    if (Object.keys(changedData).length === 0) {
      return;
    }

    this.memberService.updateMember(this.member.fitapi_user.id, changedData).subscribe({
      next: (res: any) => {
        this.member.fitapi_user = { ...this.member.fitapi_user, ...changedData };
        this.editFormData.reset(this.editFormData.value);
        this.toggleEditMode();
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
