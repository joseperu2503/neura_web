import {
  Component,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChatsService } from '../../services/chats.service';
import { UserMessageComponent } from '../../components/user-message/user-message.component';
import { AssistantMessageComponent } from '../../components/assistant-message/assistant-message.component';
import { TypingLoaderComponent } from '../../components/typing-loader/typing-loader.component';
import { ChatsStore } from '../../stores/chats.store';
import { Message } from '../../interfaces/message.interface';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { TokenService } from '../../../../core/services/token/token.service';

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
  public internalChatId = signal<string | null>(null);
  public chatsStore = inject(ChatsStore);
  private readonly router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private tokenService = inject(TokenService);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('contentDiv') contentDiv!: ElementRef;
  isAutehnticated = this.tokenService.validateToken().isValid;

  private resizeObserver?: ResizeObserver;
  public isLoading = signal<boolean>(false);
  public isCompleting = signal<boolean>(false);

  public abortSignal = signal(new AbortController());

  get messages(): Message[] {
    if (this.internalChatId() === null) {
      return [];
    }
    return this.chatsStore.messages()[this.internalChatId()!] ?? [];
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollListener();
    }
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
    if (this.internalChatId() == null) {
      const chat = await this.createChat();

      this.chatsStore.setFirstMessage(prompt);

      if (this.tokenService.validateToken().isValid) {
        this.router.navigate(['/chats', chat._id]);
      } else {
        this.changeChatId(chat._id);
      }
    } else {
      this.abortSignal().abort();
      this.abortSignal.set(new AbortController());
      this.isLoading.set(true);
      this.isCompleting.set(true);

      this.chatsStore.addMessage(this.internalChatId()!, {
        role: 'user',
        content: prompt,
        createdAt: new Date(),
      });

      this.chatsService
        .completion(this.internalChatId()!, prompt, this.abortSignal().signal)
        .subscribe({
          next: (text) => {
            this.chatsStore.addMessage(
              this.internalChatId()!,
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
              this.getChats();
            }
          },
        });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      this.changeChatId(this.chatId());
    }
  }

  changeChatId(chatId: string | null) {
    this.internalChatId.set(chatId);

    const firstMessage = this.chatsStore.getFirstMessage();
    console.log(firstMessage);
    if (firstMessage) {
      this.handleCompletion(firstMessage, true);
    } else {
      this.getChat();
    }
  }

  getChat() {
    if (!this.internalChatId() || !this.isAutehnticated) return;
    this.chatsStore.getChat(this.internalChatId()!);
  }

  getChats() {
    if (!this.isAutehnticated) return;
    this.chatsStore.getChats();
  }
}
