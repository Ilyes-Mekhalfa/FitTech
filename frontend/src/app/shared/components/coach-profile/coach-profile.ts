import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CoachService } from '../../../core/services/coach.service';
import { WebsocketService } from '../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs'; // 2. Import Subscription

@Component({
  selector: 'app-coach-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './coach-profile.html',
  styleUrls: ['./coach-profile.css'],
})
export class CoachProfile implements OnInit, OnChanges, OnDestroy {
  @Input() coach: any;
  @Output() close = new EventEmitter<void>();

  editMode = false;
  editFormData!: FormGroup;
  addCourse: FormGroup;
  private originalFormData: any = {};

  // Track socket streams for lifecycle teardowns
  private socketSubscriptions: Subscription = new Subscription();

  constructor(
    private coachService: CoachService,
    private websocketService: WebsocketService, // 3. Inject the WebSocket service
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

    // 4. Listen for real-time course additions for this specific coach
    const courseAddSub = this.websocketService.onEvent('course_added').subscribe({
      next: (newCourse: any) => {
        // Only append the course if it belongs to the coach currently being inspected
        if (this.coach && newCourse.coach_id === this.coach.id) {
          console.log('Real-time update: New course added for this coach', newCourse);
          
          // Ensure courses array exists before pushing
          if (!this.coach.courses) {
            this.coach.courses = [];
          }
          this.coach.courses.push(newCourse);
        }
      }
    });

    this.socketSubscriptions.add(courseAddSub);
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
        console.log('Update payload accepted by server');
        this.editMode = false;
        // Note: We don't overwrite this.coach manually here. 
        // The parent Coach component's socket stream handles broadcasting the update, 
        // passing it back down into this @Input() beautifully!
      },
      error: (err) => {
        console.error('Error updating the coach', err);
      },
    });
  }

  addNewCourse() {
    if (!this.addCourse.valid) {
      console.log('form invalid', this.addCourse.errors);
      return;
    }

    this.coachService.addCourse(this.coach.id, this.addCourse.value).subscribe({
      next: (res: any) => {
        console.log('Course successfully saved on server:', res);
        this.addCourse.reset(); // Wipe inputs clean upon success
      },
      error: (err: any) => {
        console.log('error happened saving course', err);
      }
    });
  }

  closeProfile() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    // 5. Tear down socket streams to prevent memory leaks
    this.socketSubscriptions.unsubscribe();
  }
}