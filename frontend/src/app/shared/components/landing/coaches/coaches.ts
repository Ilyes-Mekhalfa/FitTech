import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { LandingService } from '../../../../core/services/landing.service';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-coaches',
  imports: [CommonModule],
  templateUrl: './coaches.html',
  styleUrl: './coaches.css',
})
export class Coaches implements OnInit {

//   coaches = [
//   {
//     name: 'Alex Carter',
//     specialty: 'Strength',
//     rating: 4.9,
//     image: 'assets/coaches/coach-1.jpg'
//   },
//   {
//     name: 'Sarah Johnson',
//     specialty: 'CrossFit',
//     rating: 4.8,
//     image: 'assets/coaches/coach-2.jpg'
//   },
//   {
//     name: 'Emma Wilson',
//     specialty: 'Yoga',
//     rating: 5.0,
//     image: 'assets/coaches/coach-3.jpg'
//   },
//   {
//     name: 'Michael Brown',
//     specialty: 'Nutrition',
//     rating: 4.9,
//     image: 'assets/coaches/coach-4.jpg'
//   }
// ];
coaches: any;
  
  constructor(private landingService: LandingService) {}

  ngOnInit(): void{
    this.landingService.getCoachData().subscribe({
      next: (res: any)=>{
        console.log(res);
        this.coaches = res;
        
      },
      error: (err: any) =>{
        console.log('error fetching coaches data', err);
        
      }
    })
  }

}