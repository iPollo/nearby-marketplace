import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CityService } from '../../../../core/services/city.service';
import { CityResponse } from '../../../../core/models/listing.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  cityId: number | null = null;

  cities = signal<CityResponse[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private authService: AuthService,
    private cityService: CityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cityService.findAll().subscribe({
      next: (cities) => this.cities.set(cities),
      error: () => this.errorMessage.set('Could not load cities.')
    });
  }

  onSubmit(): void {
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    if (!this.cityId) {
      this.errorMessage.set('Please select a city.');
      return;
    }

    this.errorMessage.set(null);
    this.loading.set(true);

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      cityId: this.cityId
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(
          err.status === 409 ? 'This email is already in use.' : 'Something went wrong. Please try again.'
        );
      }
    });
  }
}
