import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { KeuzeModuleAI, SaveRecommendation } from '../../../dtos/module.dto';
import { RecommenderService } from '../../../services/recommender.service';

@Component({
  selector: 'app-recommendations',
  imports: [FormsModule],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.css'
})
export class RecommendationsComponent {
  protected studentInput = signal('');
  protected recommendations = signal<KeuzeModuleAI[]>([]);
  protected selectedRecommendations = signal<Set<number>>(new Set());
  protected isLoading = signal(false);
  protected errorMessage = signal('');
  protected successMessage = signal('');
  protected hasSearched = signal(false);

  constructor(
    private recommenderService: RecommenderService,
    private router: Router
  ) {}

  protected getRecommendations(): void {
    const input = this.studentInput().trim();

    if (!input) {
      this.errorMessage.set('Voer eerst je interesses en voorkeuren in');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.hasSearched.set(true);

    this.recommenderService.getRecommendations({ studentInput: input }).subscribe({
      next: (recommendations) => {
        this.recommendations.set(recommendations);
        this.isLoading.set(false);
        this.selectedRecommendations.set(new Set());
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het ophalen van aanbevelingen');
        this.isLoading.set(false);
      }
    });
  }

  protected toggleSelection(moduleId: number): void {
    const selected = new Set(this.selectedRecommendations());

    if (selected.has(moduleId)) {
      selected.delete(moduleId);
    } else {
      selected.add(moduleId);
    }

    this.selectedRecommendations.set(selected);
  }

  protected isSelected(moduleId: number): boolean {
    return this.selectedRecommendations().has(moduleId);
  }

  protected saveSelectedRecommendations(): void {
    const selected = this.selectedRecommendations();

    if (selected.size === 0) {
      this.errorMessage.set('Selecteer eerst één of meer aanbevelingen');
      return;
    }

    const toSave: SaveRecommendation[] = this.recommendations()
      .filter(rec => selected.has(rec.id))
      .map(rec => ({
        id: rec.id,
        name: rec.name,
        location: rec.location,
        level: rec.level,
        hybrid_score: rec.hybrid_score,
        reason_text: rec.reason_text,
        popularity_score: rec.popularity_score,
        content_score: rec.content_score,
        estimated_difficulty: rec.estimated_difficulty
      }));

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.recommenderService.saveRecommendations(toSave).subscribe({
      next: (response) => {
        this.successMessage.set('Aanbevelingen succesvol opgeslagen!');
        this.isLoading.set(false);

        // Clear selections after successful save
        setTimeout(() => {
          this.selectedRecommendations.set(new Set());
          this.successMessage.set('');
        }, 3000);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het opslaan van aanbevelingen');
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
}
