import { RouterOutlet } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './shared/components/loader/loader';
import { SideBar } from './shared/components/side-bar/side-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    LoaderComponent,
    SideBar,
  ],
  templateUrl: './app.html',
  styleUrl:    './app.css',
})
export class App implements OnInit {

  private router = inject(Router);

  showSidebar = false;  

  private readonly noSidebarRoutes = [
    'login',
    'reset-password',
    'forget-password',
    '',                 
  ];

  ngOnInit(): void {
    this.checkRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  private checkRoute(url: string): void {
    const path = url
      .split('?')[0]     
      .split('#')[0]    
      .replace(/^\//, ''); 

    const isAuthPage = this.noSidebarRoutes.includes(path);

    this.showSidebar = !isAuthPage;

    document.body.classList.toggle('no-sidebar', isAuthPage);
  }
}