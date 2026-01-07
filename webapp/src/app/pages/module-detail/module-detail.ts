import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { KeuzeModule } from '../../../dtos/module.dto';
import { KeuzemoduleService } from '../../../services/keuzemodule.service';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private keuzemoduleService: KeuzemoduleService,
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
    console.log('Inschrijven voor module:', this.module()?.name);
  }

  protected getLearningGoals(): string[] {
    const outcomes = this.module()?.learningoutcomes;
    if (!outcomes) return [];
    return outcomes.split('\n').filter((line) => line.trim().length > 0);
  }
}
