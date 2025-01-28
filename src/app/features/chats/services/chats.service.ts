import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../core/services/api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  constructor() {}

  private apiService = inject(ApiService);

  getChats() {
    return this.apiService.get(`/chats`);
  }
}
