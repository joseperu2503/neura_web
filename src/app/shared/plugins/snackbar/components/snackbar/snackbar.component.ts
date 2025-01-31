import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { Snackbar } from '../../interfaces/snackbar.interface';

@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.scss',
})
export class SnackbarComponent {
  @Output() close = new EventEmitter<void>();

  snackbar = input.required<Snackbar>();

  get icon(): string {
    if (this.snackbar().type == 'success') {
      return 'assets/icons/check.svg';
    }

    if (this.snackbar().type == 'error') {
      return 'assets/icons/error.svg';
    }

    if (this.snackbar().type == 'info') {
      return 'assets/icons/info.svg';
    }

    return '';
  }

  onClose() {
    this.close.emit();
  }
}
