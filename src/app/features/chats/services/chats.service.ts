import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { CreateChatResponse } from '../interfaces/create-chat-response.interface';
import { GetChatResponse } from '../interfaces/get-chat-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor() {}

  private apiService = inject(ApiService);

  getChats() {
    return this.apiService.get(`/chats`);
  }

  createChat() {
    return this.apiService.post<CreateChatResponse>(`/chats`, {});
  }

  getChat(chatId: string) {
    return this.apiService.get<GetChatResponse>(`/chats/${chatId}`);
  }
}
