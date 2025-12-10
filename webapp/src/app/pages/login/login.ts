import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  protected email = signal('');
  protected password = signal('');
  protected errorMessage = signal('');

  constructor(private router: Router) {}

  onSubmit(): void {
    // Basic validation
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Vul alle velden in');
      return;
    }

    // TODO: Implement actual authentication
    console.log('Login attempt:', {
      email: this.email(),
      password: '***'
    });

    // For now, just navigate to home
    this.router.navigate(['/']);
  }
}
