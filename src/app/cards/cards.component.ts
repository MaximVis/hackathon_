import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards',
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.less'
})
export class CardsComponent {

  cardForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      card_fio: ['', [Validators.required, Validators.pattern(/^[а-яА-ЯёЁ\s]+$/)]],
      card_phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]+$/)]],
      card_mail: ['', [Validators.required, Validators.email]],
      card_passport: ['', [Validators.required, Validators.pattern(/^[0-9]{4}\s?[0-9]{6}$/)]],
      card_type: ['1']
    });
  }

  authService = inject(AuthService);
  router = inject(Router)

  onSubmit() {
    if (this.cardForm.valid) {
      console.log('Форма отправлена:', this.cardForm.value);
      this.authService.createCard(this.cardForm.value).subscribe({
        next: (response) => {
          console.log('Ответ сервера:', response);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Ошибка при отправке:', error);
        }
      });

    } else {
      console.log('Форма содержит ошибки');

      this.cardForm.markAllAsTouched();
    }
  }

}
