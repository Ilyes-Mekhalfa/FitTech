import { Component } from '@angular/core';
import { LandingService} from '../../../../core/services/landing.service'
@Component({
  selector: 'app-hero',
  imports: [],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  data: any
  constructor(private landingService: LandingService){}

  ngOnInit(): void{
    this.landingService.getHeroData().subscribe({
      next: (res: any)=>{
        this.data = res
      },
      error: (err: any)=>{
        console.log('error fetching hero data',err)
      }
    })
  }

  scroll(){
    document.getElementById('plans')?.scrollIntoView({behavior: 'smooth', block: 'start' })
  }
  login(){
    alert('app link to be added later')
  }
}

