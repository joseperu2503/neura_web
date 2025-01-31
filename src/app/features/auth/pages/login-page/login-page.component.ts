import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../../../shared/plugins/snackbar';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export default class LoginPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.authService.saveToken(user.accessToken);
        this.router.navigate(['/chats']);
      },
      error: (err) => {
        this.snackbarService.show('Login failed', 'error');
        console.error('Login failed', err);
      },
    });
  }
}
