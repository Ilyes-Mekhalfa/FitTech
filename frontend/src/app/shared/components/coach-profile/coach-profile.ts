import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CoachService } from '../../../core/services/coach.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coach-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.html',
  styleUrls: ['./coach-profile.css'],
})
export class CoachProfile implements OnInit, OnChanges {
  @Input() coach: any;
  @Output() close = new EventEmitter<void>();

  editMode = false;
  editFormData!: FormGroup;
  addCourse: FormGroup;
  private originalFormData: any = {};

  constructor(
    private coachService: CoachService,
    private fb: FormBuilder,
  ) {
    this.initForm();

    this.addCourse = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      maxParticipants: [0, [Validators.required, Validators.min(0)]],
      duration: [0, [Validators.required, Validators.min(1)]],
      date: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{2}-\d{2}T(?:(?:[01]\d|2[0-3]):[0-5]\d|(?:0?[1-9]|1[0-2]):[0-5]\d\s?(?:AM|PM))$/i)]],
      level_required: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.editMode = false;
    if (this.coach) {
      console.log('Coach data initialized:', this.coach);
      this.syncOriginalData();
    }
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['coach'] && !changes['coach'].firstChange) {
      this.editMode = false;
      if (this.coach) {
        this.syncOriginalData();
        this.editFormData.reset();
        this.addCourse.reset();
      }
    }
  }

  private initForm() {
    this.editFormData = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      specialties: [''],
      biography: [''], 
    });
  }

  // Flattens nested object structure for accurate dirty/change checking
  private syncOriginalData() {
    this.originalFormData = {
      first_name: this.coach?.first_name || '',
      last_name: this.coach?.last_name || '',
      email: this.coach?.email || '',
      specialties: this.coach?.fitapi_coach?.specialties || '',
      biography: this.coach?.fitapi_coach?.biography || '',
    };
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.editFormData.patchValue(this.originalFormData);

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

    this.coachService.updateCoach(this.coach.id, changedData).subscribe({
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

  addNewCourse() {
    if(!this.addCourse.valid){
      console.log('form invalid', this.addCourse.errors);
    }

    this.coachService.addCourse(this.coach.id, this.addCourse.value).subscribe({
      next: (res: any)=>{
        console.log(res);
      },
      error: (err:any)=>{
        console.log('error happened', err);
        
      }
    })
  }
  closeProfile() {
    this.close.emit();
  }
}
