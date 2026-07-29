import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  isMenuOpen = signal(false);

  constructor(public authService: AuthService, private router: Router) {}

  get initials(): string {
    const email = this.authService.currentUserEmail();
    return email ? email.slice(0, 2).toUpperCase() : '';
  }

  toggleMenu(): void {
    this.isMenuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
