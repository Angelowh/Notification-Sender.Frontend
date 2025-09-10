import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NotificacaoComponent } from './notificacao.component';
import { WebsocketService } from '../../services/websocket.service';
import { of } from 'rxjs';

// Mock do serviço de WebSocket
class MockWebsocketService {
  onStatusUpdate() {
    return of({ mensagemId: 'mock-id', status: 'PROCESSADO' });
  }
}

describe('NotificacaoComponent', () => {
  let component: NotificacaoComponent;
  let fixture: ComponentFixture<NotificacaoComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule, NotificacaoComponent],
      providers: [
        { provide: WebsocketService, useClass: MockWebsocketService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacaoComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Certifique-se de que não há requisições pendentes após cada teste
    httpTestingController.verify();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // --- Teste corrigido: Agrupa o envio e a verificação no mesmo bloco ---
  it('should send a POST request and add a notification with "AGUARDANDO PROCESSAMENTO" status', () => {
    const mensagem = 'Nova notificação de teste';
    component.conteudoMensagem.setValue(mensagem);
    
    // 1. Dispara a requisição POST
    component.enviarNotificacao();
    
    // 2. Verifica se a notificação foi adicionada imediatamente
    expect(component.notificacoes.length).toBe(1);
    const notificacaoAdicionada = component.notificacoes[0];
    expect(notificacaoAdicionada.status).toBe('AGUARDANDO PROCESSAMENTO');
    
    // 3. Espera a requisição POST e a trata (limpa)
    const req = httpTestingController.expectOne('http://localhost:3000/api/notificar');
    expect(req.request.method).toBe('POST');
    
    // 4. Simula uma resposta de sucesso para finalizar a requisição
    req.flush({});
  });

  // --- Teste de manipulação de erro ---
  it('should update the notification status to "ERRO" on POST request failure', () => {
    const mensagem = 'Falha no envio';
    component.conteudoMensagem.setValue(mensagem);
    component.enviarNotificacao();

    const req = httpTestingController.expectOne('http://localhost:3000/api/notificar');
    
    // Simula uma resposta de erro e verifica se o status foi atualizado
    req.error(new ErrorEvent('Network error'));
    
    expect(component.notificacoes[0].status).toBe('ERRO');
  });
});