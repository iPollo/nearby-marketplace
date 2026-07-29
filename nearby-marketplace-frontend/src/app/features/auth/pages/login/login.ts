import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  constructor(private router: Router) {}

  onSubmit(): void {

    // jumper to build frontend pages, TODO: implement backend AuthService
    console.log("submit");

    this.router.navigate(['/home']);
  }

}
