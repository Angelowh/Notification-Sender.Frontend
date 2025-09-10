import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { v4 as uuidv4 } from 'uuid';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WebsocketService } from '../../services/websocket.service';
import { Subscription } from 'rxjs';

interface Notificacao {
  mensagemId: string;
  conteudoMensagem: string;
  status: 'AGUARDANDO PROCESSAMENTO' | 'ENVIADO' | 'ERRO' | 'PROCESSADO';
}

@Component({
  selector: 'app-notificacao',
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class NotificacaoComponent implements OnInit, OnDestroy {
  conteudoMensagem = new FormControl('');
  notificacoes: Notificacao[] = [];
  private statusSubscription!: Subscription;

  constructor(private http: HttpClient, private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.statusSubscription = this.websocketService.onStatusUpdate()
      .subscribe(update => {
        const notificacao = this.notificacoes.find(n => n.mensagemId === update.mensagemId);

        if (notificacao) {
          notificacao.status = update.status as Notificacao['status'];
          console.log(`Status da notificação ${notificacao.mensagemId} atualizado para ${notificacao.status}`);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  enviarNotificacao(): void {
    if (this.conteudoMensagem.value) {
      const mensagemId = uuidv4();
      const conteudo = this.conteudoMensagem.value;
      
      const payload = {
        mensagemId: mensagemId,
        conteudoMensagem: conteudo
      };

      const novaNotificacao: Notificacao = {
        mensagemId: mensagemId,
        conteudoMensagem: conteudo,
        status: 'AGUARDANDO PROCESSAMENTO'
      };

      this.notificacoes.unshift(novaNotificacao);
      this.conteudoMensagem.setValue('');

      this.http.post('http://localhost:3000/api/notificar', payload)
        .subscribe({
          next: () => {
            console.log('Requisição HTTP POST enviada com sucesso.');
          },
          error: (error) => {
            const notificacaoAtualizar = this.notificacoes.find(n => n.mensagemId === mensagemId);
            if (notificacaoAtualizar) {
              notificacaoAtualizar.status = 'ERRO';
            }
            console.error('Erro ao enviar a notificação via HTTP:', error);
          }
        });
    }
  }
}