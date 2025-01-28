import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-message-box',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './text-message-box.component.html',
})
export class TextMessageBoxComponent {
  placeholder = input<string>('');
  disableCorrections = input<boolean>(false);

  onMessage = output<string>();

  public fb = inject(FormBuilder);

  public form = this.fb.group({
    prompt: ['', Validators.required],
  });

  handleSubmit() {
    if (this.form.invalid) return;

    const { prompt } = this.form.value;

    this.onMessage.emit(prompt ?? '');
    this.form.reset();
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto'; // Resetea la altura para calcular el scrollHeight
    const maxHeight = 280; // Máxima altura permitida
    const newHeight = Math.min(textarea.scrollHeight, maxHeight); // Limita el tamaño al máximo
    textarea.style.height = `${newHeight}px`; // Ajusta la altura
  }
}
