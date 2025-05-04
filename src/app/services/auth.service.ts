import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  submitFormF(input: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reg`, { input });
  }

  createCard(input: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/card_reg`, { input });
  }

  login(input: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/log`, { input },
    { 
      withCredentials: true 
    }
  );
  }

  getProtectedData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/protect`, {
      withCredentials: true
    }).pipe(
      catchError(error => {
        if (error.status === 401) {
          throw new Error('Неверный телефон или пароль');
        }
        throw new Error('Ошибка сервера');
      })
    );
  }


  getProfile(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_profile`, {
        params: { user_id: userId.toString() },  // Передаем user_id как параметр запроса
        withCredentials: true
    }).pipe(
        catchError(error => {
            if (error.status === 401) {
                throw new Error('Неверный телефон или пароль');
            }
            throw new Error('Ошибка сервера');
        })
    );
  }
  


 

  logout(): Observable<any> {
    return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true });
  }

}
