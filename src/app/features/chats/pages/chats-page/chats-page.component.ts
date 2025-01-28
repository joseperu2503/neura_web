import {
  Component,
  inject,
  makeStateKey,
  TransferState,
  type OnInit,
} from '@angular/core';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';
import { ChatsService } from '../../services/chats.service';
import { CommonModule } from '@angular/common';

// Define una clave para el estado transferido
const CHATS_KEY = makeStateKey<any[]>('chats');

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [TextMessageBoxComponent, CommonModule],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss',
})
export default class ChatsPageComponent implements OnInit {
  private chatsService = inject(ChatsService);
  private transferState = inject(TransferState);

  chats: any[] = [];

  ngOnInit(): void {
    this.getChats();
  }

  getChats() {
    // Intenta obtener los chats desde el TransferState
    const storedChats = this.transferState.get(CHATS_KEY, null);

    if (storedChats) {
      // Si los chats están en el TransferState, úsalos
      this.chats = storedChats;
    } else {
      // Si no están en el TransferState, haz la solicitud al servidor
      this.chatsService.getChats().subscribe({
        next: (res: any) => {
          this.chats = res;
          console.log(this.chats.length)
          // Almacena los chats en el TransferState para que estén disponibles en el cliente
          this.transferState.set(CHATS_KEY, res);
        },
      });
    }
  }
}
