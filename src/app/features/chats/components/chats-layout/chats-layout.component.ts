import { Component, inject, makeStateKey, TransferState } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatsService } from '../../services/chats.service';
import { firstValueFrom } from 'rxjs';

const CHATS_KEY = makeStateKey<any[]>('chats');

@Component({
  selector: 'app-chats-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './chats-layout.component.html',
})
export class ChatsLayoutComponent {
  private chatsService = inject(ChatsService);
  private transferState = inject(TransferState);

  chats: any[] = [];

  ngOnInit(): void {
    this.getChats();
  }

  getChats() {
    // Intenta obtener los chats desde el TransferState
    const storedChats = this.transferState.get(CHATS_KEY, null);

    if (storedChats) {
      // Si los chats están en el TransferState, úsalos
      this.chats = storedChats;
    } else {
      // Si no están en el TransferState, haz la solicitud al servidor
      this.chatsService.getChats().subscribe({
        next: (res: any) => {
          this.chats = res;
          console.log(this.chats.length);
          // Almacena los chats en el TransferState para que estén disponibles en el cliente
          this.transferState.set(CHATS_KEY, res);
        },
      });
    }
  }

  async createChat() {
    try {
      const res = await firstValueFrom(this.chatsService.createChat());
      console.log(res);
      return res;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async handleCompletion(prompt: string, chatId?: string) {
    if (!chatId) {
      const chat = await this.createChat();
      chatId = chat._id;
    }
  }

  getChat() {
    this.chatsService.getChats().subscribe({
      next: (res: any) => {
        this.chats = res;
        console.log(this.chats.length);
        // Almacena los chats en el TransferState para que estén disponibles en el cliente
        this.transferState.set(CHATS_KEY, res);
      },
    });
  }
}
