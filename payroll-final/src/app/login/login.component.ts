import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  uname: string = '';
  pwd: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.errorMessage = '';
    if (!this.uname || !this.pwd) {
      this.errorMessage = 'Please fill out all required fields.';
      return;
    }
    this.authService.login(this.uname, this.pwd).subscribe({
      next: () => {
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        this.router.navigate(['/salary-group'], { replaceUrl: true }); 
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Invalid login credentials';
      },
    });
  }
}
