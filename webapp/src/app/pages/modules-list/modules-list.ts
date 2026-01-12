import { Component, signal, computed, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { KeuzeModule } from '../../../dtos/module.dto';
import { KeuzemoduleService } from '../../../services/keuzemodule.service';

@Component({
  selector: 'app-modules-list',
  imports: [FormsModule],
  templateUrl: './modules-list.html',
  styleUrl: './modules-list.css'
})
export class ModulesListComponent implements OnInit {
  protected searchQuery = signal('');
  protected selectedLevel = signal('');
  protected selectedLocation = signal('');
  protected isLoading = signal(true); // Initial page load
  protected isSearching = signal(false); // Search/filter operations
  protected errorMessage = signal('');

  protected readonly modules = signal<KeuzeModule[]>([]);
  protected readonly allModules = signal<KeuzeModule[]>([]);

  protected readonly levels = computed(() => {
    const lvls = new Set(this.allModules().map(m => m.level));
    return Array.from(lvls).sort();
  });

  protected readonly locations = computed(() => {
    const locs = new Set(this.allModules().map(m => m.location));
    return Array.from(locs).sort();
  });

  constructor(
    private router: Router,
    private keuzemoduleService: KeuzemoduleService
  ) {
    // Auto-search when filters change
    effect(() => {
      const query = this.searchQuery();
      const level = this.selectedLevel();
      const location = this.selectedLocation();

      // Only trigger search if we have filters applied and modules are loaded
      if (this.allModules().length > 0) {
        if (query || level || location) {
          this.performSearch();
        } else {
          // No filters, show all modules
          this.modules.set(this.allModules());
        }
      }
    });
  }

  ngOnInit(): void {
    this.loadAllModules();
  }

  private loadAllModules(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.keuzemoduleService.getAllKeuzeModules().subscribe({
      next: (modules) => {
        this.allModules.set(modules);
        this.modules.set(modules);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het laden van modules');
        this.isLoading.set(false);
      }
    });
  }

  private performSearch(): void {
    const query = this.searchQuery().trim();
    const level = this.selectedLevel();
    const location = this.selectedLocation();

    // If we have a search query, use the server-side search API
    if (query) {
      this.isSearching.set(true);
      this.errorMessage.set('');

      this.keuzemoduleService.searchKeuzeModules(query, location || undefined, level || undefined).subscribe({
        next: (modules) => {
          this.modules.set(modules);
          this.isSearching.set(false);
        },
        error: (error) => {
          this.errorMessage.set(error.errorMessage || 'Fout bij het zoeken van modules');
          this.isSearching.set(false);
        }
      });
    } else {
      // No search query, do client-side filtering on all modules
      let filtered = this.allModules();

      if (level) {
        filtered = filtered.filter(m => m.level === level);
      }

      if (location) {
        filtered = filtered.filter(m => m.location === location);
      }

      this.modules.set(filtered);
    }
  }

  protected viewModule(moduleId: number): void {
    this.router.navigate(['/modules', moduleId]);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedLevel.set('');
    this.selectedLocation.set('');
    this.modules.set(this.allModules());
  }
}
