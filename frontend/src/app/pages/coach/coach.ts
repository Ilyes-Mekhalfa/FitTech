import { Component, OnInit } from '@angular/core';
import { CoachService } from '../../core/services/coach.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoachProfile } from '../../shared/components/coach-profile/coach-profile';
@Component({
  selector: 'app-coach',
  imports: [CommonModule ,CoachProfile],
  templateUrl: './coach.html',
  styleUrl: './coach.css',
})
export class Coach implements OnInit {

  approvalCount: number =0;
  coachs: any;
  selectedCoach: any ;
  constructor( private router: Router, private coachService: CoachService){}

  ngOnInit(): void {
    this.coachService.getAllCoachs().subscribe({
      next: (res: any)=>{
        this.coachs = res
      },
      error: (err)=>{
        console.log(err);
        
      }
    })
  }
  addCoach(){
    
    this.router.navigate(['coach/add'])
  }

  selectCoach(coach: any){
    this.selectedCoach = coach.id;
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

  closeProfile(){
    this.selectedCoach = null;
  }
}
