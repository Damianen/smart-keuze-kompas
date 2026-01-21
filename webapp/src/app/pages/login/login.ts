import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule, TranslateModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  protected email = signal('');
  protected password = signal('');
  protected errorMessage = signal('');
  protected isLoading = signal(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  onSubmit(): void {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Vul alle velden in');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.login({
      email: this.email(),
      password: this.password()
    }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        if (response.success) {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/modules';
          this.router.navigate([returnUrl]);
        } else {
          this.errorMessage.set(response.message || 'Login mislukt');
        }
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error.errorMessage || 'Er is een fout opgetreden bij het inloggen');
      }
    });
  }
}
