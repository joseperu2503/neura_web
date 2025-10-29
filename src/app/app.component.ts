import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SnackbarWrapperComponent } from './shared/plugins/snackbar/components/snackbar-wrapper/snackbar-wrapper.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SnackbarWrapperComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
