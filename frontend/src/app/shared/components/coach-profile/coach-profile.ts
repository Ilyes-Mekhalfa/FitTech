import { Component, input } from '@angular/core';
import { CoachService } from '../../../core/services/coach.service';
@Component({
  selector: 'app-coach-profile',
  imports: [],
  templateUrl: './coach-profile.html',
  styleUrl: './coach-profile.css',
})
export class CoachProfile {
//to be done later
coach: any
 coachId = input<string>();
constructor(private coachService: CoachService){
  this.coach = {
    photo: '',
    first_name: '',
    last_name: '',
    email: '',
    clients: 0,
    rating: 0,
    experience: 0,
    specialities: '',
    biography: '',

  }
}

getCoachProfile(){
  if (this.coachId() == '') {
    throw new Error('Coach ID is missed')
  }
  this.coachService.getCoach(this.coachId).subscribe({
    next: (res) => {
      console.log(res);
      this.coach = res
    },
    error: (err) => {
      console.log(err);
    }
  })
}
close(){}
}
