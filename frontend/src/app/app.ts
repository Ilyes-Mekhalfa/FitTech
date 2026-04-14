import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './shared/components/loader/loader';
import { SideBar } from './shared/components/side-bar/side-bar';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent, SideBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  showSidebar = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.showSidebar = !['/login', '/reset-password', 'forget-password'].includes(event.url);
      });
  }
}