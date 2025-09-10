import { TestBed } from '@angular/core/testing';
import { WebsocketService } from './websocket.service';
import { Socket } from 'ngx-socket-io';
import { of } from 'rxjs';

class MockSocket {
  fromEvent(eventName: string): any {
    return of({ mensagemId: 'mock-id-123', status: 'PROCESSADO' });
  }
  emit(eventName: string, data: any): void { }
}

describe('WebsocketService', () => {
  let service: WebsocketService;
  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = new MockSocket();

    TestBed.configureTestingModule({
      providers: [
        WebsocketService,
        { provide: Socket, useValue: mockSocket }
      ]
    });

    service = TestBed.inject(WebsocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should listen for status updates and receive data', (done) => {
    service.onStatusUpdate().subscribe(data => {
      expect(data).toEqual({ mensagemId: 'mock-id-123', status: 'PROCESSADO' });
      done();
    });
  });

  it('should emit a message to the socket', () => {
    spyOn(mockSocket, 'emit');
    const testData = { event: 'testEvent', payload: 'testPayload' };
    service.emitMessage(testData.event, testData.payload);
    expect(mockSocket.emit).toHaveBeenCalledWith(testData.event, testData.payload);
  });
});