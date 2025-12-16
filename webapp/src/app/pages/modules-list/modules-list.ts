import { Component, signal, computed, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KeuzeModule } from '../../../dtos/module.dto';
import { KeuzemoduleService } from '../../../services/keuzemodule.service';

@Component({
  selector: 'app-modules-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './modules-list.html',
  styleUrl: './modules-list.css'
})
export class ModulesListComponent implements OnInit {
  protected searchQuery = signal('');
  protected selectedLevel = signal('');
  protected isLoading = signal(true);
  protected errorMessage = signal('');

  protected readonly modules = signal<KeuzeModule[]>([]);

  protected readonly levels = computed(() => {
    const lvls = new Set(this.modules().map(m => m.level));
    return Array.from(lvls).sort();
  });

  protected filteredModules = computed(() => {
    let filtered = this.modules();

    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.shortdescription.toLowerCase().includes(query)
      );
    }

    if (this.selectedLevel()) {
      filtered = filtered.filter(m => m.level === this.selectedLevel());
    }

    return filtered;
  });

  constructor(
    private router: Router,
    private keuzemoduleService: KeuzemoduleService
  ) {}

  ngOnInit(): void {
    this.loadModules();
  }

  private loadModules(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.keuzemoduleService.getAllKeuzeModules().subscribe({
      next: (modules) => {
        this.modules.set(modules);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het laden van modules');
        this.isLoading.set(false);
      }
    });
  }

  protected viewModule(moduleId: number): void {
    this.router.navigate(['/modules', moduleId]);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedLevel.set('');
  }
}
