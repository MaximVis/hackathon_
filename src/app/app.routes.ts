import { Routes } from '@angular/router';
import { AuthorizationPageComponent } from './authorization-page/authorization-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { CardsComponent } from './cards/cards.component';
import { AccountCreateComponent } from './account-create/account-create.component';
import { PersonalAccountComponent } from './personal-account/personal-account.component';
import { authGuardGuard } from './guard/auth-guard.guard';
import { TransferStatisticsComponent } from './transfer-statistics/transfer-statistics.component';

export const routes: Routes = [
    {
        path: '',
        component: MainPageComponent
    },
    {
        path: 'authorization',
        component: AuthorizationPageComponent
    },
    {
        path: 'cards',
        component: CardsComponent
    },
    {
        path: 'account_create',
        component: AccountCreateComponent
    },
    {
        path: 'profile',
        component: PersonalAccountComponent,
        canActivate: [authGuardGuard]
    },
    {
        path: 'transfer_statistucs',
        component: TransferStatisticsComponent,
        canActivate: [authGuardGuard]
    }
];
