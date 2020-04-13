import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AI_STORAGE_USERNAME } from '../constants/ai-user-constants';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate() {
    const isLogged = localStorage.getItem(AI_STORAGE_USERNAME);
    if (!isLogged) {
      this.router.navigate(['login']);
      return false;
    } else {
      return true;
    }
  }
}
