import { Component, inject } from '@angular/core';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';
import { ChatsService } from '../../services/chats.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [TextMessageBoxComponent, CommonModule],
  templateUrl: './chats-page.component.html',
})
export default class ChatsPageComponent {
  private chatsService = inject(ChatsService);
  private readonly router = inject(Router);

  async createChat() {
    try {
      const res = await firstValueFrom(this.chatsService.createChat());
      return res;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async handleCompletion(prompt: string) {
    const chat = await this.createChat();

    this.router.navigate(['/chats', chat._id]);
  }
}
