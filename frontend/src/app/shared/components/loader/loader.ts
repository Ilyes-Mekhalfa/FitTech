import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { AsyncPipe,NgIf } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [ AsyncPipe, NgIf],
  templateUrl: './loader.html'
})
export class LoaderComponent {
  loading$: any;
  
  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;

  }

}