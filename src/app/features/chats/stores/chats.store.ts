import {
  Injectable,
  PLATFORM_ID,
  TransferState,
  inject,
  makeStateKey,
  signal,
} from '@angular/core';

import { ChatsService } from '../services/chats.service';
import { Message } from '../interfaces/message.interface';
import { isPlatformServer } from '@angular/common';
import { Chat } from '../interfaces/get-chats-response.interface';

const CHATS_KEY = makeStateKey<any[]>('chats');

@Injectable({
  providedIn: 'root',
})
export class ChatsStore {
  private chatsService = inject(ChatsService);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  chats = signal<Chat[]>([]);
  firstMessage = signal<string | null>(null);
  messages = signal<{ [key: string]: Message[] }>({});

  getChats() {
    console.log('getChats');
    // Intenta obtener los chats desde el TransferState
    const storedChats = this.transferState.get(CHATS_KEY, null);

    if (storedChats) {
      // Si los chats están en el TransferState, úsalos
      this.chats.set(storedChats);
      this.transferState.set(CHATS_KEY, null);
    } else {
      // Si no están en el TransferState, haz la solicitud al servidor
      this.chatsService.getChats().subscribe({
        next: (res: any) => {
          this.chats.set(res);

          // Almacena los chats en el TransferState para que estén disponibles en el cliente
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(CHATS_KEY, res);
          }
        },
      });
    }
  }

  getChat(chatId: string) {
    this.chatsService.getChat(chatId).subscribe({
      next: (res) => {
        this.messages.update((prev) => {
          return {
            ...prev,
            [res._id]: res.messages,
          };
        });
      },
    });
  }

  setFirstMessage(prompt: string) {
    this.firstMessage.set(prompt);
  }

  getFirstMessage() {
    const firstMessage = this.firstMessage();
    this.firstMessage.set(null);
    return firstMessage;
  }

  addMessage(chatId: string, message: Message, pop = false) {
    this.messages.update((prev) => {
      // Si pop es true, eliminamos el último mensaje antes de agregar el nuevo
      const updatedMessages = prev[chatId]
        ? pop
          ? [...prev[chatId].slice(0, -1), message] // Eliminar el último y agregar el nuevo
          : [...prev[chatId], message] // Solo agregar el nuevo mensaje
        : [message]; // Si no hay mensajes, solo agregar el primero

      return {
        ...prev,
        [chatId]: updatedMessages,
      };
    });
  }
}
