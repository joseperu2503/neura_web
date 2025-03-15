import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-external-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './external-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalLayoutComponent {
  private route = inject(Router);
  onSignIn() {
    this.route.navigate(['/login']);
  }

  onSignUp() {
    this.route.navigate(['/register']);
  }
}
