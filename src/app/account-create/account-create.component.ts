import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-account-create',
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './account-create.component.html',
  styleUrl: './account-create.component.less'
})

export class AccountCreateComponent {
  
  accountForm: FormGroup;
  authService = inject(AuthService);

  constructor(private fb: FormBuilder) {
    this.accountForm = this.fb.group({
      card_phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      card_mail: ['', [Validators.required, Validators.email]],
      profile_password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.accountForm.valid) {
      console.log('Форма валидна', this.accountForm.value);
      
      this.authService.submitFormF(this.accountForm.value).subscribe({
        next: (response) => {
          console.log('Ответ сервера:', response);
        },
        error: (error) => {
          console.error('Ошибка при отправке:', error);
        }
      });
    } else {
      console.log('Форма невалидна');
    }
  }

  

  
}
