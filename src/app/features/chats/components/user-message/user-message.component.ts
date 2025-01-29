import { Component, input } from '@angular/core';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [],
  templateUrl: './user-message.component.html',
})
export class UserMessageComponent {
  text = input.required<string>();
}
