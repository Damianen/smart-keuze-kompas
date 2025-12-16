import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  protected name = signal('');
  protected surname = signal('');
  protected email = signal('');
  protected birthDate = signal('');
  protected password = signal('');
  protected confirmPassword = signal('');
  protected errorMessage = signal('');
  protected successMessage = signal('');
  protected isLoading = signal(false);

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.name() || !this.surname() || !this.email() || !this.birthDate() || !this.password()) {
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

    this.isLoading.set(true);

    this.userService.register({
      name: this.name(),
      surname: this.surname(),
      email: this.email(),
      birthDate: new Date(this.birthDate()),
      password: this.password()
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          this.successMessage.set('Account succesvol aangemaakt! Je wordt doorgestuurd...');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage.set(response.message || 'Registratie mislukt');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.errorMessage || 'Er is een fout opgetreden bij de registratie');
      }
    });
  }
}
