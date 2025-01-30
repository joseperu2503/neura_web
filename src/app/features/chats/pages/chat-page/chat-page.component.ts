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
import { ChatsService } from '../../services/chats.service';
import { UserMessageComponent } from '../../components/user-message/user-message.component';
import { AssistantMessageComponent } from '../../components/assistant-message/assistant-message.component';
import { TypingLoaderComponent } from '../../components/typing-loader/typing-loader.component';
import { ChatsStore } from '../../stores/chats.store';
import { Message } from '../../interfaces/message.interface';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

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
  public chatId = input<string | null>(null);
  public chatsStore = inject(ChatsStore);
  private readonly router = inject(Router);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('contentDiv') contentDiv!: ElementRef;

  private resizeObserver?: ResizeObserver;
  public isLoading = signal<boolean>(false);
  public isCompleting = signal<boolean>(false);

  public abortSignal = signal(new AbortController());

  get messages(): Message[] {
    if (this.chatId() === null) {
      return [];
    }
    return this.chatsStore.messages()[this.chatId()!] ?? [];
  }

  ngOnInit(): void {}

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
      return res;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async handleCompletion(prompt: string, isNewChat = false) {
    if (this.chatId() == null) {
      const chat = await this.createChat();
      this.chatsStore.setFirstMessage(prompt);
      this.router.navigate(['/chats', chat._id]);
    } else {
      this.abortSignal().abort();
      this.abortSignal.set(new AbortController());
      this.isLoading.set(true);
      this.isCompleting.set(true);

      this.chatsStore.addMessage(this.chatId()!, {
        role: 'user',
        content: prompt,
        createdAt: new Date(),
      });

      this.chatsService
        .completion(this.chatId()!, prompt, this.abortSignal().signal)
        .subscribe({
          next: (text) => {
            this.chatsStore.addMessage(
              this.chatId()!,
              {
                role: 'assistant',
                content: text,
                createdAt: new Date(),
              },
              !this.isLoading()
            );
            this.isLoading.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
            this.isCompleting.set(false);
          },
          complete: () => {
            this.isLoading.set(false);
            this.isCompleting.set(false);
            if (isNewChat) {
              this.chatsStore.getChats();
            }
          },
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      console.log('ChatId changed', this.chatId());
      const firstMessage = this.chatsStore.getFirstMessage();
      console.log('First message:', firstMessage);
      if (firstMessage) {
        this.handleCompletion(firstMessage, true);
      } else {
        if (this.chatId() != null) {
          this.getChat();
        }
      }
    }
  }

  getChat() {
    this.chatsStore.getChat(this.chatId()!);
  }
}
