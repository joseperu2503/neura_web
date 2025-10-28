import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TokenService } from '../../../../core/services/token/token.service';
import { AuthService } from '../../../auth/services/auth.service';
import { AssistantMessageComponent } from '../../components/assistant-message/assistant-message.component';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';
import { TypingLoaderComponent } from '../../components/typing-loader/typing-loader.component';
import { UserMessageComponent } from '../../components/user-message/user-message.component';
import { ChatsService } from '../../services/chats.service';
import { ChatsStore } from '../../stores/chats.store';

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
  private platformId = inject(PLATFORM_ID);
  private tokenService = inject(TokenService);
  private authService = inject(AuthService);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('contentDiv') contentDiv!: ElementRef;

  private resizeObserver?: ResizeObserver;

  public abortSignal = signal(new AbortController());
  public internalChatId = this.chatsStore.internalChatId;
  public isLoading = this.chatsStore.isLoading;
  public isCompleting = this.chatsStore.isCompleting;

  messages = computed(() => {
    if (!this.internalChatId()) return [];
    return (
      this.chatsStore.chats().find((c) => c._id === this.internalChatId())
        ?.messages ?? []
    );
  });

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
    // obtenemos el token
    let token = this.tokenService.getToken();
    this.isLoading.set(true);
    // si no hay token, intentamos registrarnos como guest
    if ((!token || token.payload.isGuest) && !this.internalChatId()) {
      try {
        const user = await firstValueFrom(this.authService.guestRegister());
        this.tokenService.saveToken(user.accessToken);
        token = this.tokenService.getToken();
      } catch (error) {
        console.error('Error during guest registration:', error);
        return;
      }
    }

    this.isCompleting.set(true);

    if (this.internalChatId() == null) {
      const chat = await this.createChat();
      this.chatsStore.addChat(chat);
      this.changeChatId(chat._id);

      if (token && !token.payload.isGuest) {
        await this.router.navigate(['/chats', chat._id]);
      }
    }

    this.abortSignal().abort();
    this.abortSignal.set(new AbortController());

    this.chatsStore.addMessage(this.internalChatId()!, {
      _id: new Date().toISOString(),
      role: 'user',
      content: prompt,
      createdAt: new Date(),
      isComplete: true,
    });

    this.chatsService
      .completion(this.internalChatId()!, prompt, this.abortSignal().signal)
      .subscribe({
        next: (message) => {
          this.chatsStore.addMessage(this.internalChatId()!, message);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      this.changeChatId(this.chatId());
    }
  }

  changeChatId(chatId: string | null) {
    if (chatId === this.internalChatId()) return;
    this.internalChatId.set(chatId);
    if (this.isCompleting()) return;
    if (!chatId) return;

    this.getChat(chatId);
  }

  getChat(chatId: string) {
    this.chatsStore.getChat(chatId);
  }

  getChats() {
    const token = this.tokenService.getToken();
    if (!token) return;
    this.chatsStore.getChats();
  }
}
