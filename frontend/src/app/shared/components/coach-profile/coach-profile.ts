import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CoachService } from '../../../core/services/coach.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-coach-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.html',
  styleUrl: './coach-profile.css',
})
export class CoachProfile {
  @Input() coach: any;
  @Output() close = new EventEmitter<void>();
  editMode = false;
  editFormData: FormGroup;
  originalFormData: any = {};
  constructor(
    private coachService: CoachService,
    private fb: FormBuilder,
  ) {
    this.editFormData = fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      specialty: [''],
    });
  }

  onInit() {}

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.editFormData.patchValue({
        first_name: this.coach?.fitapi_user?.first_name,
        last_name: this.coach?.fitapi_user?.last_name,
        email: this.coach?.fitapi_user?.email,
        specialty: this.coach?.specialties,
      });
    }
    //storing the original data in variable to compare it later with the updated data
    this.originalFormData = { ...this.originalFormData };
  }

  //filtering the changed fields from the unchanged fields
  private getChangedFields(): any {
    const changedFields: any = {};
    const formControls = this.editFormData.controls;

    Object.keys(formControls).forEach((key) => {
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

  //saving the profile after updating
  saveProfile() {
    const changedData = this.getChangedFields();

    if (Object.keys(changedData).length == 0) {
      return;
    }

    this.coachService.updateCoach(this.coach.fitapi_user.id, changedData).subscribe({
      next: (res) => {
        console.log('coach updated successfully');
        this.coach = res;
      },
      error: (err) => {
        console.log('error updating the coach', err);
      },
    });
  }
}
