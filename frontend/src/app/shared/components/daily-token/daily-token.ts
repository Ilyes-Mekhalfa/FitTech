// qr-display/qr-display.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import QRCode from 'qrcode';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-qr-display',
  template: `
    <div class="qr-container">
      <h2 class="qr-title">Daily Access QR</h2>

      <div class="qr-wrapper">
        <canvas #qrCanvas></canvas>
      </div>

      <div class="token-meta">
        <span class="token-id">Token: {{ maskedToken }}</span>
        <span class="countdown">{{ timeRemaining }}</span>
      </div>

      <div class="live-counter">
        <span class="dot"></span>
        {{ checkinsToday }} check-ins today
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh; /* Centers the whole container on the screen if needed */
      background-color: #f8f9fa; 
      font-family: system-ui, -apple-system, sans-serif;
    }

    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      max-width: 400px;
      width: 100%;
      text-align: center;
    }

    .qr-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 1.5rem 0;
    }

    .qr-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1rem;
      background: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }

    canvas {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .token-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 1rem;
      background: #f1f3f5;
      padding: 0.5rem 1rem;
      border-radius: 20px;
    }

    .token-id {
      font-family: monospace;
      font-weight: 600;
    }

    .countdown {
      color: #b90014; /* Using FitTech brand red for urgency */
      font-weight: 500;
    }

    .live-counter {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: #495057;
      font-weight: 500;
    }

    .dot {
      width: 8px;
      height: 8px;
      background-color: #2b8a3e; /* Green active pulse indicator */
      border-radius: 50%;
      display: inline-block;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { opacity: 0.4; }
      50% { opacity: 1; }
      100% { opacity: 0.4; }
    }
  `]
})
export class DailyToken implements OnInit, OnDestroy {
  checkinsToday = 0;
  maskedToken = '';
  timeRemaining = '';
  private subs = new Subscription();

  // Added ViewChild to safely target the canvas inside Angular
  @ViewChild('qrCanvas', { static: true }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadTodayQr();

    this.subs.add(
      interval(60_000)
        .pipe(switchMap(() => this.dashboardService.dailyToken()))
        .subscribe({
          next: (res: any) => {
            this.renderQr(res.token);
          },
          error: (err) => {
            console.log('error', err);
          },
        }),
    );
  }

  private async loadTodayQr() {
    const res: any = await firstValueFrom(this.dashboardService.dailyToken());
    this.renderQr(res.token);
  }

  private async renderQr(token: string) {
    // Replaced generic document.querySelector with the precise template ref
    const canvas = this.qrCanvas.nativeElement;
    await QRCode.toCanvas(canvas, token, {
      width: 320, // Increased size to make it big and prominent
      margin: 1,
      color: { dark: '#b90014', light: '#ffffff' },
    });
    
    this.maskedToken = token.substring(0, 8) + '...';
    this.updateCountdown();
  }

  private updateCountdown() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    this.timeRemaining = `Resets in ${h}h ${m}m`;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}