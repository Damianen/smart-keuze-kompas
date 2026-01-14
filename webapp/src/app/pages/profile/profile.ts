import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeuzeModuleAI } from '../../../dtos/module.dto';
import { RecommenderService } from '../../../services/recommender.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  protected savedModules = signal<KeuzeModuleAI[]>([]);
  protected isLoading = signal(true);
  protected errorMessage = signal('');

  constructor(
    private recommenderService: RecommenderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSavedModules();
  }

  private loadSavedModules(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.recommenderService.getSavedRecommendations().subscribe({
      next: (modules) => {
        this.savedModules.set(modules);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het laden van opgeslagen modules');
        this.isLoading.set(false);
      }
    });
  }

  protected viewModuleDetail(moduleId: number): void {
    this.router.navigate(['/modules', moduleId]);
  }

  protected removeModule(moduleId: number): void {
    // TODO: Implement remove functionality if needed
    console.log('Remove module:', moduleId);
  }

  protected browseModules(): void {
    this.router.navigate(['/modules']);
  }
}
