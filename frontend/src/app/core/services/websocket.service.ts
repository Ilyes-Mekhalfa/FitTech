import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: Socket;
  private readonly SOCKET_URL = 'http://localhost:3000'; 

  constructor() {
    this.socket = io(this.SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server with ID:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  
  onEvent(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });

      return () => {
        this.socket.off(eventName);
      };
    });
  }


  emitEvent(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}