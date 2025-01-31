import { Component, inject, signal } from '@angular/core';
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

  public showPassword = signal(false);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (user) => {
        this.authService.saveToken(user.accessToken);
        this.router.navigate(['/chats']);
      },
      error: (err) => {
        if (err.status === 401) {
          this.snackbarService.show('Invalid email or password', 'error');
        } else {
          this.snackbarService.show(
            'Something went wrong. Please try again later.',
            'error'
          );
        }
      },
    });
  }

  toggleShowPassword() {
    this.showPassword.update((prev) => !prev);
  }
}
