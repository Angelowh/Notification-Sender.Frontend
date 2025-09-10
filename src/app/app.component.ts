import { Component } from '@angular/core';
import { NotificacaoComponent } from "./components/notificacao/notificacao.component";

@Component({
  selector: 'app-root',
  imports: [NotificacaoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'notification-sender.frontend';
}
