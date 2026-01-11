import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KeuzeModuleAI } from '../../../dtos/module.dto';
import { RecommenderService } from '../../../services/recommender.service';

@Component({
  selector: 'app-saved-recommendations',
  imports: [],
  templateUrl: './saved-recommendations.html',
  styleUrl: './saved-recommendations.css'
})
export class SavedRecommendationsComponent implements OnInit {
  protected savedRecommendations = signal<KeuzeModuleAI[]>([]);
  protected isLoading = signal(true);
  protected errorMessage = signal('');

  constructor(
    private recommenderService: RecommenderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSavedRecommendations();
  }

  private loadSavedRecommendations(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.recommenderService.getSavedRecommendations().subscribe({
      next: (recommendations) => {
        this.savedRecommendations.set(recommendations);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het laden van opgeslagen aanbevelingen');
        this.isLoading.set(false);
      }
    });
  }

  protected viewModuleDetail(moduleId: number): void {
    this.router.navigate(['/modules', moduleId]);
  }

  protected getScoreColor(score: number): string {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  }

  protected getScoreLabel(score: number): string {
    if (score >= 0.7) return 'Hoog';
    if (score >= 0.4) return 'Gemiddeld';
    return 'Laag';
  }

  protected getDifficultyColor(difficulty: number): string {
    if (difficulty >= 7) return 'text-red-600';
    if (difficulty >= 4) return 'text-yellow-600';
    return 'text-green-600';
  }

  protected getDifficultyLabel(difficulty: number): string {
    if (difficulty >= 7) return 'Moeilijk';
    if (difficulty >= 4) return 'Gemiddeld';
    return 'Makkelijk';
  }

  protected getRecommendations(): void {
    this.router.navigate(['/recommendations']);
  }
}
