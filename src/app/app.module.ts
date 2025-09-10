import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ReactiveFormsModule } from '@angular/forms';
import { NotificacaoComponent } from './components/notificacao/notificacao.component';

const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

@NgModule({
  declarations: [
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AppComponent,
    NotificacaoComponent,
    SocketIoModule.forRoot(config),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }