import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        if (this.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        this.router.navigate(['/dashboard']); // Redirect to main layout
      },
      error: () => alert('Invalid login credentials'),
    });
  }
}
