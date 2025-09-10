import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  constructor(private socket: Socket) {}

  onStatusUpdate(): Observable<{ mensagemId: string; status: string }> {
    return this.socket.fromEvent<{ mensagemId: string; status: string; }>('status');
  }

  emitMessage(event: string, payload: any): void {
    this.socket.emit(event, payload);
  }
}