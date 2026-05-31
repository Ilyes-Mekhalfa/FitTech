import { Component, OnInit } from '@angular/core';
import { CoachService } from '../../core/services/coach.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoachProfile } from '../../shared/components/coach-profile/coach-profile';
@Component({
  selector: 'app-coach',
  imports: [CommonModule, CoachProfile],
  templateUrl: './coach.html',
  styleUrl: './coach.css',
})
export class Coach implements OnInit {
  approvalCount: number = 0;
  coachs: any;
  originalList: any;
  pendingRequests: any;
  selectedCoach: any;
  currentFilter: 'all' | 'FITNESS' | 'MMA' | 'BODY BUILDER' = 'all';

  constructor(
    private router: Router,
    private coachService: CoachService,
  ) {}

  ngOnInit(): void {
    this.coachService.getAllCoaches().subscribe({
      next: (res: any) => {
        console.log(res);
        this.coachs = res.coaches;
        this.originalList = res.coaches;
        this.pendingRequests = res.pendingRequests;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  addCoach() {
    this.router.navigate(['coach/add']);
  }

  selectCoach(coach: any) {
    this.selectedCoach = coach;
  }

  deleteCoach(coach: any) {
    alert('are you sure to delete this coach?');
    this.coachService.deleteCoach(coach.id).subscribe({
      next: (res) => {
        console.log('coach deleted successfully');
      },
      error: (err) => {
        console.log('error deleting coach', err);
      },
    });
  }
  archiveCoach(coach: any) {
    alert('are you sure you want to archive this coach?');
    this.coachService.archiveCoach(coach.id).subscribe({
      next: (res: any) => {
        console.log('coach archived successfully');
      },
      error: (err: any) => {
        console.log('error archiving coach', err);
      },
    });
  }

  approveApproval(req: any) {
    this.coachService.updateCoach(req.fitapi_coach?.id, { is_active: true }).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  rejectApproval(req: any) {
    alert('hitting this button will delete the coach permanently');
    this.coachService.deleteCoach(req.fitapi_coach?.id).subscribe({
      next: (res) => {
        console.log('coach deleted successfully', res);
      },
      error: (err) => {
        console.log('error deleting coach', err);
      },
    });
  }

  searchCoach(event: any) {
    const value = (event.target as HTMLInputElement).value;
    this.coachs = this.originalList.filter(
      (e: any) =>
        e.first_name.toLowerCase().includes(value.toLowerCase()) ||
        e.last_name.toLowerCase().includes(value.toLowerCase()),
    );
  }

  filterCoach(filter: any) {
    this.currentFilter = filter;    
    if (filter == 'all') {
      this.coachs = this.originalList;
    } else {
      this.coachs = this.originalList.filter((e: any) =>
        e.fitapi_coach.specialties.toLowerCase().includes(filter.toLowerCase())
      
      ); //cuz the mobile backend didnt specified if the specialties are written in upper or lower case
    }
  }
  closeProfile() {
    this.selectedCoach = null;
  }
}
