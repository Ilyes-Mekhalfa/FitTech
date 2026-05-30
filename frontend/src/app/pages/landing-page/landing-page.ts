import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/components/landing/navbar/navbar';
import { Hero} from '../../shared/components/landing/hero/hero'
@Component({
  selector: 'app-landing-page',
  imports: [CommonModule, Navbar, Hero],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
