import { Component, inject } from '@angular/core';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';
import { ChatsService } from '../../services/chats.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [TextMessageBoxComponent, CommonModule],
  templateUrl: './chats-page.component.html',
})
export default class ChatsPageComponent {
  private chatsService = inject(ChatsService);

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
}
