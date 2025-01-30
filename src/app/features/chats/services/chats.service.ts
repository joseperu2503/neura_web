import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { CreateChatResponse } from '../interfaces/create-chat-response.interface';
import { GetChatResponse } from '../interfaces/get-chat-response.interface';
import { CompletionResponse } from '../interfaces/completion-response.interface';
import { GetChatsResponse } from '../interfaces/get-chats-response.interface';
import { completionStreamUseCase } from '../use-cases/completion.use-case';
import { Observable, Subject } from 'rxjs';
import {
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { AuthService } from '../../auth/services/auth.service';
import { TokenService } from '../../../core/services/token/token.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor() {}

  private apiService = inject(ApiService);
  private tokenService = inject(TokenService);

  getChats() {
    return this.apiService.get<GetChatsResponse>(`/chats`);
  }

  createChat() {
    let url = `/chats`;
    if (!this.tokenService.validateToken().isValid) {
      url = `/chats/guest`;
    }

    return this.apiService.post<CreateChatResponse>(url, {});
  }

  getChat(chatId: string) {
    return this.apiService.get<GetChatResponse>(`/chats/${chatId}`);
  }

  completion(
    chatId: string,
    content: string,
    abortSignal: AbortSignal
  ): Observable<string> {
    let url = `/chats/completion`;
    if (!this.tokenService.validateToken().isValid) {
      url = `/chats/guest/completion`;
    }

    return new Observable<string>((observer) => {
      const abortSubject = new Subject<void>(); // Notificador de cancelación

      // Escuchar cuando se cancele la petición
      abortSignal.addEventListener('abort', () => {
        abortSubject.next(); // Emitimos una señal de cancelación
        abortSubject.complete();
        observer.complete(); // Finaliza el Observable
      });

      this.apiService.postStream(url, { chatId, content }).subscribe({
        next: async (event: HttpEvent<string>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const response = (event as HttpDownloadProgressEvent).partialText!;

            if (response != '') {
              observer.next(response);
            }
          } else if (event.type === HttpEventType.Response) {
            observer.complete();
          }
        },
        error: (err) => observer.error(err),
      });
    });
  }
}
