import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-authorization-page',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './authorization-page.component.html',
  styleUrl: './authorization-page.component.less'
})
export class AuthorizationPageComponent {

  isAuthenticated = false;
  router = inject(Router)

  ngOnInit() {
    this.authService.getProtectedData().subscribe({
      next: () => {
        this.router.navigate(['/profile']);
        this.isAuthenticated = true;
        console.log('авторизован', this.isAuthenticated);
      },
      error: () => {
        this.isAuthenticated = false;
        console.log('не авторизован', this.isAuthenticated);
      }
    });
  }

  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      card_phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      profile_password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  authService = inject(AuthService);

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Форма отправлена:', this.loginForm.value);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Ответ сервера:', response);
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Ошибка при отправке:', error);
        }
      });

    } else {
      console.log('Форма невалидна');
      // Пометить все поля как "touched" для отображения ошибок
      this.loginForm.markAllAsTouched();
    }
  }
}
