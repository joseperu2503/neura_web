import { Component, inject, makeStateKey } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ChatsStore } from '../../stores/chats.store';
import { AuthService } from '../../../auth/services/auth.service';

const CHATS_KEY = makeStateKey<any[]>('chats');

@Component({
  selector: 'app-chats-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './chats-layout.component.html',
})
export class ChatsLayoutComponent {
  public chatsStore = inject(ChatsStore);
  private authService = inject(AuthService);

  private readonly router = inject(Router);

  ngOnInit(): void {
    this.chatsStore.getChats();
  }

  newChat() {
    this.router.navigate(['/chats']);
  }

  goChat(chatId: string) {
    this.router.navigate(['/chats', chatId]);
  }

  logout() {
    this.authService.logout();
  }
}
