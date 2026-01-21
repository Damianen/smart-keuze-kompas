import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { KeuzemoduleService } from '../../../services/keuzemodule.service';
import { KeuzeModule } from '../../../dtos/module.dto';

@Component({
  selector: 'app-home',
  imports: [RouterLink, TranslateModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  protected modules = signal<KeuzeModule[]>([]);
  protected isLoading = signal(true);

  // Computed stats
  protected moduleCount = computed(() => this.modules().length);

  protected ectsPerModule = computed(() => {
    const modules = this.modules();
    if (modules.length === 0) return 0;
    // Get the most common ECTS value or first value if all are same
    const ectsCounts = modules.reduce((acc, m) => {
      acc[m.studycredit] = (acc[m.studycredit] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostCommon = Object.entries(ectsCounts)
      .sort(([, a], [, b]) => b - a)[0];
    return mostCommon ? Number(mostCommon[0]) : 0;
  });

  protected periodCount = computed(() => {
    const modules = this.modules();
    if (modules.length === 0) return 0;
    // Count unique locations as periods
    const uniqueLocations = new Set(modules.map(m => m.location));
    return uniqueLocations.size;
  });

  constructor(private keuzemoduleService: KeuzemoduleService) {}

  ngOnInit(): void {
    this.loadModules();
  }

  private loadModules(): void {
    this.isLoading.set(true);
    this.keuzemoduleService.getAllKeuzeModules().subscribe({
      next: (modules) => {
        this.modules.set(modules);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }
}
