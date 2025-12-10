import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  protected name = signal('');
  protected email = signal('');
  protected password = signal('');
  protected confirmPassword = signal('');
  protected study = signal('');
  protected interest = signal('');
  protected errorMessage = signal('');
  protected successMessage = signal('');

  protected readonly studies = [
    'Informatica',
    'Bedrijfskunde',
    'Technische Informatica',
    'Software Engineering',
    'Data Science',
    'Cyber Security',
    'Game Development'
  ];

  protected readonly interests = [
    'Development',
    'Data & Analytics',
    'Infrastructure & Cloud',
    'Security',
    'Design & UX',
    'Project Management',
    'Business & Marketing'
  ];

  constructor(private router: Router) {}

  onSubmit(): void {
    // Reset messages
    this.errorMessage.set('');
    this.successMessage.set('');

    // Validation
    if (!this.name() || !this.email() || !this.password() || !this.study() || !this.interest()) {
      this.errorMessage.set('Vul alle verplichte velden in');
      return;
    }

    if (this.password() !== this.confirmPassword()) {
      this.errorMessage.set('Wachtwoorden komen niet overeen');
      return;
    }

    if (this.password().length < 8) {
      this.errorMessage.set('Wachtwoord moet minimaal 8 tekens bevatten');
      return;
    }

    // TODO: Implement actual registration
    console.log('Registration attempt:', {
      name: this.name(),
      email: this.email(),
      study: this.study(),
      interest: this.interest(),
      password: '***'
    });

    this.successMessage.set('Account succesvol aangemaakt! Je wordt doorgestuurd...');

    // Navigate to login after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }
}
