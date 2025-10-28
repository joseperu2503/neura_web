import { Component, input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-assistant-message',
  standalone: true,
  imports: [MarkdownModule],
  templateUrl: './assistant-message.component.html',
})
export class AssistantMessageComponent {
  text = input.required<string>();
  audioUrl = input<string>();
  imageInfo = input<{ url: string; alt: string }>();
}
