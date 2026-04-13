import { Component } from '@angular/core';
import { CoachService } from '../../core/services/coach.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-coach',
  imports: [],
  templateUrl: './coach.html',
  styleUrl: './coach.css',
})
export class Coach {

  approvalCount: number =0;
  constructor( private router: Router, private coachService: CoachService){}

  addCoach(){
    this.router.navigate(['/coach/add'])
  }

  showCoach(){
    return 1
  }

  editCoach(){
    return 1
  }
  
  deleteCoach(){
    return 1
  }
  messageCoach(){
    return 1
  }

  approveApproval(){
    return 1
  }
  rejectApproval(){
    return 1
  }
}
