import { Component, inject, makeStateKey, TransferState } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChatsService } from '../../services/chats.service';

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
  private readonly router = inject(Router);

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

  newChat() {
    this.router.navigate(['/chats']);
  }

  goChat(chatId: string) {
    this.router.navigate(['/chats', chatId]);
  }
}
