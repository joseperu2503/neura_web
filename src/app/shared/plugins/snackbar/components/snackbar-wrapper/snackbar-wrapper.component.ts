import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-snackbar-wrapper',
  standalone: true,
  imports: [SnackbarComponent],
  templateUrl: './snackbar-wrapper.component.html',
  styleUrl: './snackbar-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnackbarWrapperComponent {
  snackbarService = inject(SnackbarService);
}
