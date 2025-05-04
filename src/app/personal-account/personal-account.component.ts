import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TuiIcon } from '@taiga-ui/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-personal-account',
  imports: [TuiIcon, RouterLink, FormsModule, CommonModule],
  templateUrl: './personal-account.component.html',
  styleUrl: './personal-account.component.less'
})
export class PersonalAccountComponent {

  constructor(private authService: AuthService) {}
  router = inject(Router)

  userId: number | null = null; 
  userName: string | null = null; // null вместо имени
  totalBalance: number | null = null; // null вместо баланса

  cards: any[] = [];

  ngOnInit() {
    this.authService.getProtectedData().subscribe({
      next: (response) => {
        this.userId = response.user;
        console.log('ID пользователя:', this.userId);
        
        if (this.userId) {
          this.authService.getProfile(this.userId).subscribe({
            next: (profile_data) => {
              // Обновляем данные компонента
              this.userName = profile_data.user_name || this.userName;
              this.totalBalance = profile_data.total_money || this.totalBalance;
              this.cards = profile_data.massive_data?.map((cardData: any) => ({
                title: `${cardData[2]} ${cardData[0]}`, 
                balance: cardData[1],
              })) || [];
            },
            error: (error) => {
              console.error('Ошибка при получении профиля:', error);
            }
          });
        }
      },
      error: () => {
        this.userId = null;
        console.log('Ошибка авторизации');
      }
    });
  }

  showTransferModal: boolean = false;
  selectedCardIndex: number = 0;
  transferAmount: number = 0;
  amountExceedsBalance: boolean = false;
  isFormValid: boolean = false;

  showTransferForm() {
    this.showTransferModal = true;
    this.selectedCardIndex = 0;
    this.transferAmount = 0;
    this.amountExceedsBalance = false;
    this.isFormValid = false;
  }

  closeTransferForm() {
    this.showTransferModal = false;
  }

  validateAmount() {
    if (this.cards.length > 0 && this.selectedCardIndex >= 0) {
      const selectedCard = this.cards[this.selectedCardIndex];
      this.amountExceedsBalance = this.transferAmount > selectedCard.balance;
    }
    this.isFormValid = this.transferAmount > 0 && !this.amountExceedsBalance;
  }

  submitTransferForm() {
    if (this.isFormValid && !this.amountExceedsBalance) {
      // Здесь логика отправки формы
      console.log('Перевод с карты:', this.cards[this.selectedCardIndex].title);
      console.log('Сумма:', this.transferAmount);
      
      // Закрываем форму после отправки
      this.closeTransferForm();
    }
  }



  showWithdrawalModal: boolean = false;
  withdrawalPhone: string = '';
  withdrawalAmount: number = 0;
  withdrawalAmountExceedsBalance: boolean = false;
  isWithdrawalFormValid: boolean = false;

// Методы для формы снятия денег
showWithdrawalForm() {
  this.showWithdrawalModal = true;
  this.selectedCardIndex = 0;
  this.withdrawalPhone = '';
  this.withdrawalAmount = 0;
  this.withdrawalAmountExceedsBalance = false;
  this.isWithdrawalFormValid = false;
}

closeWithdrawalForm() {
  this.showWithdrawalModal = false;
}

validateWithdrawalAmount() {
  if (this.cards.length > 0 && this.selectedCardIndex >= 0) {
    const selectedCard = this.cards[this.selectedCardIndex];
    this.withdrawalAmountExceedsBalance = this.withdrawalAmount > selectedCard.balance;
  }
  this.isWithdrawalFormValid = this.withdrawalAmount > 0 && 
                             !this.withdrawalAmountExceedsBalance && 
                             this.withdrawalPhone?.length === 11;
}

submitWithdrawalForm() {
  if (this.isWithdrawalFormValid && !this.withdrawalAmountExceedsBalance) {
    // Здесь логика отправки формы снятия денег
    console.log('Снятие с карты:', this.cards[this.selectedCardIndex].title);
    console.log('Телефон:', this.withdrawalPhone);
    console.log('Сумма:', this.withdrawalAmount);
    
    // Закрываем форму после отправки
    this.closeWithdrawalForm();
  }
}



  onLogout(): void {
    console.log('logout');
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/authorization']);
      }
    });
  }

}
