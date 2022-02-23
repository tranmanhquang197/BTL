import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  public getToken() {
    const token: string = window.sessionStorage.getItem('tokenNewFeet') || '';
    return token;
  }



  public setToken(token: any) {
    window.sessionStorage.setItem('tokenNewFeet',token);
  }


  public clear() {
    window.sessionStorage.removeItem('tokenNewFeet');
  }
}
