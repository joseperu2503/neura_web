import { Component, inject, input, signal, SimpleChanges } from '@angular/core';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import { GetChatResponse } from '../../interfaces/get-chat-response.interface';
import { UserMessageComponent } from '../../components/user-message/user-message.component';
import { AssistantMessageComponent } from '../../components/assistant-message/assistant-message.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    TextMessageBoxComponent,
    CommonModule,
    UserMessageComponent,
    AssistantMessageComponent,
  ],
  templateUrl: './chat-page.component.html',
})
export default class ChatPageComponent {
  private chatsService = inject(ChatsService);
  public chatId = input.required<string>();

  chat = signal<GetChatResponse | null>(null);

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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      this.getChat();
    }
  }

  getChat() {
    console.log(this.chatId());
    this.chatsService.getChat(this.chatId()).subscribe({
      next: (res) => {
        console.log(res);
        this.chat.set(res);
      },
    });
  }
}
