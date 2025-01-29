import {
  Component,
  ElementRef,
  inject,
  input,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { ChatsService } from '../../services/chats.service';
import { GetChatResponse } from '../../interfaces/get-chat-response.interface';
import { UserMessageComponent } from '../../components/user-message/user-message.component';
import { AssistantMessageComponent } from '../../components/assistant-message/assistant-message.component';
import { TypingLoaderComponent } from '../../components/typing-loader/typing-loader.component';

@Component({
  selector: 'app-chat-page',
  standalone: true,
  imports: [
    TextMessageBoxComponent,
    CommonModule,
    UserMessageComponent,
    AssistantMessageComponent,
    TypingLoaderComponent,
  ],
  templateUrl: './chat-page.component.html',
})
export default class ChatPageComponent {
  private chatsService = inject(ChatsService);
  public chatId = input.required<string>();

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('contentDiv') contentDiv!: ElementRef;

  private resizeObserver?: ResizeObserver;

  chat = signal<GetChatResponse | null>(null);
  isLoading = signal<boolean>(false);

  ngAfterViewInit() {
    this.initScrollListener();
  }

  ngOnDestroy() {
    // Desconectar el observador cuando el componente se destruya
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  // Inicializar el escuchador de eventos para el cambio de tamaño
  initScrollListener() {
    const contentDiv = this.contentDiv.nativeElement;

    // Usamos ResizeObserver para detectar cambios en la altura del div hijo
    this.resizeObserver = new ResizeObserver(() => {
      this.scrollToBottom();
    });

    // Empezamos a observar el div hijo para cambios en su tamaño
    this.resizeObserver.observe(contentDiv);
  }

  // Método para hacer scroll al final del contenedor
  scrollToBottom() {
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
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

  async handleCompletion(prompt: string) {
    this.isLoading.set(true);
    this.chat.update((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            role: 'user',
            content: prompt,
            createdAt: new Date(),
          },
        ],
      };
    });
    this.chatsService.completion(this.chatId(), prompt).subscribe({
      next: (res) => {
        console.log(res);
        this.isLoading.set(false);

        this.chat.update((prev) => {
          if (!prev) return null;

          return {
            ...prev,
            messages: [
              ...prev.messages,
              {
                role: 'assistant',
                content: res.response,
                createdAt: new Date(),
              },
            ],
          };
        });
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
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
