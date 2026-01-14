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

  // Pagination
  protected currentPage = signal(1);
  protected itemsPerPage = signal(9); // 9 modules per page (3x3 grid)

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

  // Pagination computed properties
  protected readonly totalPages = computed(() => {
    return Math.ceil(this.modules().length / this.itemsPerPage());
  });

  protected readonly paginatedModules = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.modules().slice(start, end);
  });

  protected readonly pageNumbers = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    // Always show first page
    pages.push(1);

    // Show pages around current page
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Always show last page if there is more than one page
    if (total > 1 && !pages.includes(total)) {
      pages.push(total);
    }

    return pages.sort((a, b) => a - b);
  });

  // Results display range
  protected readonly startIndex = computed(() => {
    return (this.currentPage() - 1) * this.itemsPerPage() + 1;
  });

  protected readonly endIndex = computed(() => {
    return Math.min(this.currentPage() * this.itemsPerPage(), this.modules().length);
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
        // Reset to page 1 when filters change
        this.currentPage.set(1);
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

  // Pagination methods
  protected goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  protected nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  protected previousPage(): void {
    this.goToPage(this.currentPage() - 1);
  }
}
