import { Component, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Module {
  id: number;
  title: string;
  description: string;
  ects: number;
  period: string;
  category: string;
  prerequisites?: string;
  learningGoals?: string[];
}

@Component({
  selector: 'app-modules-list',
  imports: [RouterLink, FormsModule],
  templateUrl: './modules-list.html',
  styleUrl: './modules-list.css'
})
export class ModulesListComponent {
  protected searchQuery = signal('');
  protected selectedCategory = signal('');
  protected selectedPeriod = signal('');

  protected readonly modules = signal<Module[]>([
    {
      id: 1,
      title: 'Web Development Advanced',
      description: 'Leer moderne web frameworks en best practices voor front-end ontwikkeling.',
      ects: 5,
      period: 'Periode 1',
      category: 'Development',
      prerequisites: 'Basis programmeerkennis',
      learningGoals: [
        'Werken met moderne JavaScript frameworks',
        'Responsive web design implementeren',
        'API integratie en state management'
      ]
    },
    {
      id: 2,
      title: 'Data Science & Analytics',
      description: 'Ontdek de wereld van data analyse, machine learning en visualisatie.',
      ects: 5,
      period: 'Periode 1',
      category: 'Data',
      prerequisites: 'Statistiek en Python kennis',
      learningGoals: [
        'Data analyseren met Python',
        'Machine learning modellen bouwen',
        'Data visualisatie technieken'
      ]
    },
    {
      id: 3,
      title: 'Cloud Infrastructure',
      description: 'Werk met cloud platforms zoals AWS, Azure en leer over DevOps praktijken.',
      ects: 5,
      period: 'Periode 2',
      category: 'Infrastructure',
      prerequisites: 'Linux basics en netwerken',
      learningGoals: [
        'Cloud services configureren',
        'CI/CD pipelines opzetten',
        'Infrastructure as Code'
      ]
    },
    {
      id: 4,
      title: 'Mobile App Development',
      description: 'Bouw native en cross-platform mobiele applicaties voor iOS en Android.',
      ects: 5,
      period: 'Periode 2',
      category: 'Development',
      prerequisites: 'Object georiënteerd programmeren',
      learningGoals: [
        'Native mobile apps ontwikkelen',
        'Cross-platform frameworks gebruiken',
        'Mobile UI/UX patterns toepassen'
      ]
    },
    {
      id: 5,
      title: 'Cybersecurity',
      description: 'Leer over security principes, ethical hacking en bescherming van systemen.',
      ects: 5,
      period: 'Periode 3',
      category: 'Security',
      prerequisites: 'Netwerken en besturingssystemen',
      learningGoals: [
        'Security vulnerabilities identificeren',
        'Penetration testing uitvoeren',
        'Beveiligingsmaatregelen implementeren'
      ]
    },
    {
      id: 6,
      title: 'UX/UI Design',
      description: 'Ontwerp gebruiksvriendelijke interfaces en leer over user experience research.',
      ects: 5,
      period: 'Periode 3',
      category: 'Design',
      prerequisites: 'Basis design kennis',
      learningGoals: [
        'User research uitvoeren',
        'Wireframes en prototypes maken',
        'Usability testing toepassen'
      ]
    }
  ]);

  protected readonly categories = computed(() => {
    const cats = new Set(this.modules().map(m => m.category));
    return Array.from(cats);
  });

  protected readonly periods = computed(() => {
    const pers = new Set(this.modules().map(m => m.period));
    return Array.from(pers);
  });

  protected filteredModules = computed(() => {
    let filtered = this.modules();

    // Search filter
    const query = this.searchQuery().toLowerCase();
    if (query) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (this.selectedCategory()) {
      filtered = filtered.filter(m => m.category === this.selectedCategory());
    }

    // Period filter
    if (this.selectedPeriod()) {
      filtered = filtered.filter(m => m.period === this.selectedPeriod());
    }

    return filtered;
  });

  constructor(private router: Router) {}

  protected viewModule(moduleId: number): void {
    this.router.navigate(['/modules', moduleId]);
  }

  protected clearFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedPeriod.set('');
  }
}
