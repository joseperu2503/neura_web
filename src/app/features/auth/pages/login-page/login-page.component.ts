import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
})
export default class LoginPageComponent {
  constructor(private authRepository: AuthService, private router: Router) {
    console.log('dddd');
  }

  ngOnInit() {
    console.log('rrrrr');
  }

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authRepository.login(email, password).subscribe({
      next: (user) => {
        this.authRepository.saveToken(user.accessToken);
        this.router.navigate(['/chats']);
      },
      error: (err) => {
        console.error('Login failed', err);
      },
    });
  }
}
