import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  email = '';
  password = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 401 ? 'Invalid email or password.' : 'Something went wrong. Please try again.'
        );
      }
    });
  }
}
