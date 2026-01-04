import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Smart Keuze Kompas');
  protected mobileMenuOpen = signal(false);

  constructor(
    protected userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userService.checkAuth().subscribe();
  }

  protected toggleMobileMenu(): void {
    this.mobileMenuOpen.set(!this.mobileMenuOpen());
  }

  protected logout(): void {
    this.userService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    });
  }
}
