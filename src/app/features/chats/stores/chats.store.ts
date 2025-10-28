import {
  Injectable,
  PLATFORM_ID,
  TransferState,
  inject,
  makeStateKey,
  signal,
} from '@angular/core';

import { isPlatformServer } from '@angular/common';
import { Chat } from '../interfaces/chat.interface';
import { Message } from '../interfaces/message.interface';
import { ChatsService } from '../services/chats.service';

const CHATS_KEY = makeStateKey<any[]>('chats');

@Injectable({
  providedIn: 'root',
})
export class ChatsStore {
  private chatsService = inject(ChatsService);
  private transferState = inject(TransferState);
  private platformId = inject(PLATFORM_ID);

  public chats = signal<Chat[]>([]);
  public internalChatId = signal<string | null>(null);
  public isLoading = signal<boolean>(false);
  public isCompleting = signal<boolean>(false);

  getChats() {
    // Intenta obtener los chats desde el TransferState
    const storedChats = this.transferState.get(CHATS_KEY, null);

    if (storedChats) {
      // Si los chats están en el TransferState, úsalos
      this.chats.set(storedChats);
      this.transferState.set(CHATS_KEY, null);
    } else {
      // Si no están en el TransferState, haz la solicitud al servidor
      this.chatsService.getChats().subscribe({
        next: (res) => {
          //barrer todos los chats y si el chatId ya esta en el array solo actualizar el chat menos los messages
          this.chats.update((prev) => {
            // Mapeamos los previos, actualizando los que vinieron en res
            const updated = prev.map((chat) => {
              const incoming = res.find((r) => r._id === chat._id);
              if (incoming) {
                // Reemplaza los datos del chat, pero mantiene messages
                return {
                  ...incoming,
                  messages: chat.messages,
                };
              }
              return chat; // si no vino en res, se queda igual
            });

            // Agregamos los que vinieron en res y aún no están en prev
            const newOnes = res
              .filter((r) => !prev.some((p) => p._id === r._id))
              .map((r) => {
                return {
                  ...r,
                  messages: [],
                };
              });

            return [...updated, ...newOnes];
          });

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
        this.chats.update((prev) => {
          // Buscar si el chat ya existe
          const index = prev.findIndex((c) => c._id === chatId);
          if (index !== -1) {
            // Si existe, actualizamos todo menos los mensajes
            const updated = [...prev];
            updated[index] = {
              ...res,
              messages: res.messages, // conserva los mensajes del servicio
            };
            return updated;
          } else {
            // Si no existe, lo agregamos con mensajes vacíos
            return [...prev, res];
          }
        });
      },
    });
  }

  addMessage(chatId: string, message: Message) {
    this.chats.update((prev) => {
      return prev.map((chat) => {
        if (chat._id === chatId) {
          const messages = chat.messages;
          const index = messages.findIndex((m) => m._id === message._id);

          const updatedMessages =
            index !== -1
              ? messages.map((m, i) => (i === index ? message : m))
              : [...messages, message];

          return {
            ...chat,
            messages: updatedMessages,
          };
        }
        return chat;
      });
    });
  }

  addChat(chat: Chat) {
    this.chats.update((prev) => {
      return [...prev, chat];
    });
  }
}
