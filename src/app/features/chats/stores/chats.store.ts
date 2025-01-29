import {
  Injectable,
  TransferState,
  inject,
  makeStateKey,
  signal,
} from '@angular/core';

import { ChatsService } from '../services/chats.service';

const CHATS_KEY = makeStateKey<any[]>('chats');

@Injectable({
  providedIn: 'root',
})
export class ChatsStore {
  private chatsService = inject(ChatsService);
  private transferState = inject(TransferState);

  chats = signal<any[]>([]);

  getChats() {
    // Intenta obtener los chats desde el TransferState
    const storedChats = this.transferState.get(CHATS_KEY, null);

    if (storedChats) {
      // Si los chats están en el TransferState, úsalos
      this.chats.set(storedChats);
    } else {
      // Si no están en el TransferState, haz la solicitud al servidor
      this.chatsService.getChats().subscribe({
        next: (res: any) => {
          this.chats.set(res);
          console.log(this.chats().length);
          // Almacena los chats en el TransferState para que estén disponibles en el cliente
          this.transferState.set(CHATS_KEY, res);
        },
      });
    }
  }
}
