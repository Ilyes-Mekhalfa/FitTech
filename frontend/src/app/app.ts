import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { LoaderComponent } from './shared/components/loader/loader';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }