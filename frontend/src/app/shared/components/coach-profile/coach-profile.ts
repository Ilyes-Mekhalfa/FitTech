import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CoachService } from '../../../core/services/coach.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.html',
  styleUrls: ['./coach-profile.css'],
})
export class CoachProfile implements OnInit {
  @Input() coach: any;
  @Output() close = new EventEmitter<void>();

  editMode = false;
  editFormData!: FormGroup;
  private originalFormData: any = {};

  constructor(
    private coachService: CoachService,
    private fb: FormBuilder,
  ) {
    this.initForm();
  }

  ngOnInit() {
    if (this.coach) {
      console.log('Coach data initialized:', this.coach);
      this.syncOriginalData();
    }
  }

  private initForm() {
    this.editFormData = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      specialty: [''],
      biography: [''] // Added missing biography control
    });
  }

  // Flattens nested object structure for accurate dirty/change checking
  private syncOriginalData() {
    this.originalFormData = {
      first_name: this.coach?.fitapi_user?.first_name || '',
      last_name: this.coach?.fitapi_user?.last_name || '',
      email: this.coach?.fitapi_user?.email || '',
      specialty: this.coach?.specialties || '',
      biography: this.coach?.biography || ''
    };
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editFormData.patchValue(this.originalFormData);
    }
  }

  private getChangedFields(): any {
    const changedFields: any = {};
    const formControls = this.editFormData.controls;

    Object.keys(formControls).forEach((key) => {
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
    if (this.editFormData.invalid) return;

    const changedData = this.getChangedFields();

    if (Object.keys(changedData).length === 0) {
      this.editMode = false;
      return;
    }

    this.coachService.updateCoach(this.coach.fitapi_user.id, changedData).subscribe({
      next: (res) => {
        console.log('Coach updated successfully');
        this.coach = res;
        this.syncOriginalData();
        this.editMode = false;
      },
      error: (err) => {
        console.error('Error updating the coach', err);
      },
    });
  }

  closeProfile() {
    this.close.emit();
  }
}