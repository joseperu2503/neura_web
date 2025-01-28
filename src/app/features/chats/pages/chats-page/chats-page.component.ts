import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { TextMessageBoxComponent } from '../../components/text-message-box/text-message-box.component';

@Component({
  selector: 'app-chats-page',
  standalone: true,
  imports: [TextMessageBoxComponent],
  templateUrl: './chats-page.component.html',
  styleUrl: './chats-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatsPageComponent implements OnInit {
  ngOnInit(): void {}

  chatsSidebar = [
    'Instalar FVM en macOS paso a paso',
    'Apache Server Deployment Failure Log',
    'Saludo inicial y oferta de ayuda.',
    'Saludo inicial y oferta de ayuda.',
    'Saludo inicial y oferta de ayuda.',
    'Optimizing Laravel Excel Large Data Imports',
    'SQL Update Issue with Null Scheduling',
    'Spring Boot JPA Application Log Analysis',
  ];
}
