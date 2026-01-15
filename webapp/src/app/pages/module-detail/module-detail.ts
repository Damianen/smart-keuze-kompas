import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KeuzeModule } from '../../../dtos/module.dto';
import { KeuzemoduleService } from '../../../services/keuzemodule.service';
import { RecommenderService } from '../../../services/recommender.service';

@Component({
  selector: 'app-module-detail',
  imports: [RouterLink],
  templateUrl: './module-detail.html',
  styleUrl: './module-detail.css',
})
export class ModuleDetailComponent implements OnInit {
  protected module = signal<KeuzeModule | null>(null);
  protected loading = signal(true);
  protected errorMessage = signal('');
  protected linkCopied = signal(false);
  protected saving = signal(false);
  protected saveSuccess = signal(false);
  protected saveError = signal('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private keuzemoduleService: KeuzemoduleService,
    private recommenderService: RecommenderService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = parseInt(params['id'], 10);
      this.loadModule(id);
    });
  }

  private loadModule(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.keuzemoduleService.getKeuzeModuleById(id).subscribe({
      next: (module) => {
        if (module) {
          this.module.set(module);
        } else {
          this.errorMessage.set('Module niet gevonden');
        }
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het laden van de module');
        this.loading.set(false);
      },
    });
  }

  protected enrollInModule(): void {
    const currentModule = this.module();
    if (!currentModule || this.saving()) {
      return;
    }

    this.saving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set('');

    // Transform KeuzeModule to SaveRecommendation format
    const saveData = [{
      id: currentModule.id,
      name: currentModule.name,
      location: currentModule.location,
      level: currentModule.level,
      hybrid_score: 0,
      reason_text: 'Handmatig opgeslagen via module detail pagina',
      popularity_score: 0,
      content_score: 0,
      estimated_difficulty: 0
    }];

    this.recommenderService.saveRecommendations(saveData).subscribe({
      next: (response) => {
        this.saving.set(false);
        if (response.status) {
          this.saveSuccess.set(true);
          // Reset success message after 3 seconds
          setTimeout(() => {
            this.saveSuccess.set(false);
          }, 3000);
        } else {
          this.saveError.set(response.message || 'Er is iets misgegaan bij het opslaan');
        }
      },
      error: (error) => {
        this.saving.set(false);
        this.saveError.set(error.errorMessage || 'Fout bij het opslaan van de module');
      }
    });
  }

  protected getLearningGoals(): string[] {
    const outcomes = this.module()?.learningoutcomes;
    if (!outcomes) return [];
    return outcomes.split('\n').filter((line) => line.trim().length > 0);
  }

  protected async copyLink(): Promise<void> {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      this.linkCopied.set(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        this.linkCopied.set(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  }
}
