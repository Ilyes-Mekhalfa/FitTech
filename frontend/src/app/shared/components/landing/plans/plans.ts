import { Component } from '@angular/core';
import { LandingService } from '../../../../core/services/landing.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-plans',
  imports: [CommonModule],
  templateUrl: './plans.html',
  styleUrl: './plans.css',
})
export class Plans {
  allPlans: any[] = [];
  filteredPlans: any[] = [];
  activeFilter:  'daily' | 'monthly' | 'quarterly' | 'yearly' = 'monthly';

  constructor(private landingService: LandingService) {}

  ngOnInit() {
    this.landingService.getPlansData().subscribe({
      next: (res: any) => {
        console.log(res);
        
        this.allPlans =  res;
        this.setPlanFilter('monthly')
      },
      error: (err) => {
        console.log('error fetching plans data', err);
      }
    });
  }

  setPlanFilter(filter: 'daily' | 'monthly' | 'quarterly' | 'yearly') {
    this.activeFilter = filter;
    this.filteredPlans = this.allPlans.filter((e)=> e.type == filter)
  }
}
