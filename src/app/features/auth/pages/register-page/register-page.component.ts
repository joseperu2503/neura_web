import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../../../shared/plugins/snackbar';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register-page.component.html',
})
export default class RegisterPageComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackbarService = inject(SnackbarService);

  public showPassword = signal(false);

  registerForm: FormGroup = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/(?=.*[a-z])/), // Al menos una minúscula
        Validators.pattern(/(?=.*[A-Z])/), // Al menos una mayúscula
        Validators.pattern(/(?=.*\d)/), // Al menos un número
        Validators.pattern(/(?=.*[@$!%*?&])/), // Al menos un carácter especial
      ]),
      passwordConfirmation: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator } // Validación de coincidencia de contraseñas
  );

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password, passwordConfirmation } = this.registerForm.value;

    this.authService.register(email, password, passwordConfirmation).subscribe({
      next: (user) => {
        this.authService.saveToken(user.accessToken);
        this.router.navigate(['/chats']);
      },
      error: (err) => {
        if (err.status === 400) {
          console.log(err)
          this.snackbarService.show(err.error.message, 'error');
        } else {
          this.snackbarService.show(
            'Something went wrong. Please try again later.',
            'error'
          );
        }
      },
    });
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const passwordConfirmation = formGroup.get('passwordConfirmation')?.value;
    return password === passwordConfirmation
      ? null
      : { passwordsMismatch: true };
  }

  toggleShowPassword() {
    this.showPassword.update((prev) => !prev);
  }
}
