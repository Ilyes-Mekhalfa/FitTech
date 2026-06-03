import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MemberService } from '../../../core/services/member.service';
import { PlanService } from '../../../core/services/plan.service';
import { WebsocketService } from '../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-member-profile',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {
  @Input() member: any;
  @Output() close = new EventEmitter<void>();

  editMode = false;
  editFormData: FormGroup;
  subscriptionFormData: FormGroup;
  availablePlans: any[] = [];
  originalFormData: any = {};

  // Track socket subscriptions
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private memberService: MemberService, 
    private planService: PlanService, 
    private websocketService: WebsocketService, // 3. Inject the WebSocket service
    private fb: FormBuilder
  ) {
    this.editFormData = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
    });

    this.subscriptionFormData = this.fb.group({
      plan: [''],
      sessions: [1],
      paymentMethod: ['']
    });
  }

  ngOnInit() {
    this.getAvailablePlans();

    // 4. Listen for new subscription membership plans added in real time
    const planAddSub = this.websocketService.onEvent('plan_added').subscribe({
      next: (newPlan: any) => {
        console.log('Real-time update: Adding new plan option to dropdown', newPlan);
        this.availablePlans.push(newPlan);
      }
    });

    // 5. Listen for updates to membership pricing or details
    const planUpdateSub = this.websocketService.onEvent('plan_updated').subscribe({
      next: (updatedPlan: any) => {
        console.log('Real-time update: Updating dropdown plan option data', updatedPlan.id);
        this.availablePlans = this.availablePlans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
      }
    });

    // 6. Listen for deleted membership plans to remove them from options immediately
    const planDeleteSub = this.websocketService.onEvent('plan_deleted').subscribe({
      next: (data: { id: string }) => {
        console.log('Real-time update: Removing plan option from dropdown', data.id);
        this.availablePlans = this.availablePlans.filter(p => p.id !== data.id);
        
        // Reset selection if the currently selected plan was deleted
        if (this.subscriptionFormData.get('plan')?.value === data.id) {
          this.subscriptionFormData.patchValue({ plan: '' });
        }
      }
    });

    this.socketSubscriptions.add(planAddSub);
    this.socketSubscriptions.add(planUpdateSub);
    this.socketSubscriptions.add(planDeleteSub);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
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
      next: (res: any) => {
        this.availablePlans = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  private getChangedFields(): any {
    const changedFields: any = {};
    const formControls = this.editFormData.controls;

    Object.keys(formControls).forEach(key => {
      const control = formControls[key];
      const currentValue = control.value;
      const originalValue = this.originalFormData[key];

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
      next: () => {
        console.log('Member update dispatched successfully');
        this.toggleEditMode();
        // The parent component listens for real-time updates and pushes
        // the modified data down into the member @Input() cleanly!
      },
      error: (err: any) => {
        console.log('Error updating member:', err);
      }
    });
  }

  updateSubscription() {
    // Un-comment and plug in matching socket broadcast events here when ready!
  }

  closeProfile() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    // 7. Cleanup subscriptions to prevent memory leaks
    this.socketSubscriptions.unsubscribe();
  }
}