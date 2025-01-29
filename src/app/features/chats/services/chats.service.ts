import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';
import { CreateChatResponse } from '../interfaces/create-chat-response.interface';
import { GetChatResponse } from '../interfaces/get-chat-response.interface';
import { CompletionResponse } from '../interfaces/completion-response.interface';
import { GetChatsResponse } from '../interfaces/get-chats-response.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor() {}

  private apiService = inject(ApiService);

  getChats() {
    return this.apiService.get<GetChatsResponse>(`/chats`);
  }

  createChat() {
    return this.apiService.post<CreateChatResponse>(`/chats`, {});
  }

  getChat(chatId: string) {
    return this.apiService.get<GetChatResponse>(`/chats/${chatId}`);
  }

  completion(chatId: string, prompt: string) {
    const body = {
      chatId: chatId,
      content: prompt,
    };
    return this.apiService.post<CompletionResponse>(`/chats/completion`, body);
  }
}
