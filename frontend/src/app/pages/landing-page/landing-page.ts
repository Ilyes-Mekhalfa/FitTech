import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/components/landing/navbar/navbar';
import { Hero} from '../../shared/components/landing/hero/hero'
import { Coaches } from '../../shared/components/landing/coaches/coaches'
import { Plans } from '../../shared/components/landing/plans/plans'
import { Footer } from '../../shared/components/footer/footer'
@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, Navbar, Hero, Coaches, Plans, Plans, Footer],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
