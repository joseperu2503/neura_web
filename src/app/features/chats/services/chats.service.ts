import {
  HttpDownloadProgressEvent,
  HttpEvent,
  HttpEventType,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { ApiService } from '../../../core/services/api/api.service';
import { GetChatResponseDto } from '../dto/get-chat-response.dto';
import { GetChatsResponseDto } from '../dto/get-chats-response.dto';
import { Chat } from '../interfaces/chat.interface';
import { CreateChatResponse } from '../interfaces/create-chat-response.interface';
import { Message } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor() {}

  private apiService = inject(ApiService);

  getChats(): Observable<Chat[]> {
    return this.apiService.get<GetChatsResponseDto>(`/chats`).pipe(
      map((res) =>
        res.map((chat) => ({
          ...chat,
          messages: [],
        }))
      )
    );
  }

  createChat() {
    let url = `/chats/create`;

    return this.apiService.get<CreateChatResponse>(url);
  }

  getChat(chatId: string): Observable<Chat> {
    return this.apiService
      .post<GetChatResponseDto>(`/chats/details`, { chatId })
      .pipe(
        map((res): Chat => {
          return {
            ...res,
            messages: res.messages.map((m) => ({
              ...m,
              isComplete: true,
            })),
          };
        })
      );
  }

  completion(
    chatId: string,
    prompt: string,
    abortSignal: AbortSignal
  ): Observable<Message> {
    let lastText = '';
    let message = '';
    let id = '';
    let isComplete = false;

    return new Observable<Message>((observer) => {
      const abortSubject = new Subject<void>(); // Notificador de cancelación

      // Escuchar cuando se cancele la petición
      abortSignal.addEventListener('abort', () => {
        abortSubject.next(); // Emitimos una señal de cancelación
        abortSubject.complete();
        observer.complete(); // Finaliza el Observable
      });

      this.apiService
        .postStream('/chats/completion', { chatId, prompt })
        .subscribe({
          next: async (event: HttpEvent<string>) => {
            if (event.type === HttpEventType.DownloadProgress) {
              const response =
                (event as HttpDownloadProgressEvent).partialText || '';

              // Calcula solo el texto nuevo
              const newChunk = response.substring(lastText.length);
              lastText = response; // <- importante: actualizamos con el total recibido

              // Filtra los tipos de mensajes que no quieres
              if (newChunk.startsWith('data:')) {
                //recortar los 5 primeros caracteres 'data:'
                const dataStr = newChunk.substring(5);
                //convertir el string a un array de bytes
                const json = JSON.parse(dataStr);
                //obtener el id del mensaje
                id = json.messageId;
              } else {
                if (newChunk.includes('[DONE]')) {
                  isComplete = true;
                } else {
                  message += newChunk;
                }

                observer.next({
                  _id: id,
                  role: 'assistant',
                  content: message,
                  createdAt: new Date(),
                  isComplete: isComplete,
                });
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
