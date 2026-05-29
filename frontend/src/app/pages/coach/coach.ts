import { Component, OnInit } from '@angular/core';
import { CoachService } from '../../core/services/coach.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoachProfile } from '../../shared/components/coach-profile/coach-profile';
@Component({
  selector: 'app-coach',
  imports: [CommonModule , CoachProfile],
  templateUrl: './coach.html',
  styleUrl: './coach.css',
})
export class Coach implements OnInit {

  approvalCount: number =0;
  coachs: any;
  pendingRequests: any;
  selectedCoach: any ;
  constructor( private router: Router, private coachService: CoachService){}

  ngOnInit(): void {
    this.coachService.getAllCoaches().subscribe({
      next: (res: any)=>{
        console.log(res);
        this.coachs = res.coaches;
        this.pendingRequests =  res.pendingRequests;
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
    this.selectedCoach = coach;
  }

  
  deleteCoach(coach: any){
    alert('are you sure to delete this coach?')
    this.coachService.deleteCoach(coach.id).subscribe({
      next: (res)=>{
        console.log('coach deleted successfully');
        
      },
      error: (err)=>{
        console.log('error deleting coach', err);
        
      }
    })
  }
  archiveCoach(coach: any){
    alert('are you sure you want to archive this coach?')
    this.coachService.archiveCoach(coach.id).subscribe({
      next: (res: any)=>{
        console.log('coach archived successfully');
        
      },
      error: (err: any)=>{
        console.log('error archiving coach', err);
        
      }
    })
  }

  approveApproval(req: any){
    this.coachService.updateCoach(req.fitapi_coach?.id, {is_active: true}).subscribe({
      next: (res)=>{
        console.log(res);        
      },
      error: (err)=>{
        console.log(err);      
      }
    })
  }

  rejectApproval(req: any){
    alert('hitting this button will delete the coach permanently')
    this.coachService.deleteCoach(req.fitapi_coach?.id).subscribe({
      next: (res)=>{
        console.log('coach deleted successfully',res);
        
      },
      error: (err)=>{
        console.log('error deleting coach', err);
        
      }
    })
    
  }

  closeProfile(){
    this.selectedCoach = null;
  }
}
