import { Component, Inject, Optional } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ACCESS_TOKEN } from './core/services/token/token.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    @Optional()
    @Inject(ACCESS_TOKEN)
    tokenServer: string
  ) {
    console.log({ tokenServer });
  }
}
