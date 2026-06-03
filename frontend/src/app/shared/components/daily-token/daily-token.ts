// qr-display/qr-display.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DashboardService } from '../../../core/services/dashboard.service';
import { WebsocketService } from '../../../core/services/websocket.service'; // 1. Import your WebSocket Service
import { CommonModule } from '@angular/common';
import QRCode from 'qrcode';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-qr-display',
  imports: [CommonModule],
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
      min-height: 100vh;
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
      color: #b90014;
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
      background-color: #2b8a3e;
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
  private socketSubs = new Subscription();
  private countdownInterval: any;

  @ViewChild('qrCanvas', { static: true }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(
    private dashboardService: DashboardService,
    private websocketService: WebsocketService // 2. Inject the WebSocket service
  ) {}

  ngOnInit() {
    // 1. Fetch data when entering the page
    this.loadTodayData();

    // 2. Start the local clock ticker (tocks every second client-side)
    this.startCountdownTicker();

    // 3. Listen for WebSocket token rotations
    const tokenSub = this.websocketService.onEvent('token_rotated').subscribe({
      next: (res: { token: string }) => {
        console.log('Real-time update: Token rotated by server!');
        this.renderQr(res.token);
      },
      error: (err) => console.error('Token stream socket error', err)
    });

    // 4. Listen for real-time turnstile member check-ins
    const checkinSub = this.websocketService.onEvent('member_checked_in').subscribe({
      next: (res: { totalCheckinsToday: number }) => {
        console.log('Real-time update: Member checked in!');
        this.checkinsToday = res.totalCheckinsToday;
      },
      error: (err) => console.error('Check-in stream socket error', err)
    });

    this.socketSubs.add(tokenSub);
    this.socketSubs.add(checkinSub);
  }

  private async loadTodayData() {
    try {
      const res: any = await firstValueFrom(this.dashboardService.dailyToken());
      this.checkinsToday = res.checkinsToday || 0;
      this.renderQr(res.token);
    } catch (err) {
      console.error('Failed fetching initial token values:', err);
    }
  }

  private async renderQr(token: string) {
    if (!token) return;
    const canvas = this.qrCanvas.nativeElement;
    await QRCode.toCanvas(canvas, token, {
      width: 320,
      margin: 1,
      color: { dark: '#b90014', light: '#ffffff' },
    });
    
    this.maskedToken = token.substring(0, 8) + '...';
    this.updateCountdown();
  }

  private startCountdownTicker() {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  private updateCountdown() {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    
    if (diff <= 0) {
      this.timeRemaining = 'Resetting...';
      return;
    }

    const h = Math.floor(diff / 3_600_000);
    const m = Math.floor((diff % 3_600_000) / 60_000);
    const s = Math.floor((diff % 60_000) / 1000);
    
    this.timeRemaining = `Resets in ${h}h ${m}m ${s}s`;
  }

  ngOnDestroy() {
    this.socketSubs.unsubscribe();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}