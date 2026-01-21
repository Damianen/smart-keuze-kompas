import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SavedCollection } from '../../../dtos/module.dto';
import { RecommenderService } from '../../../services/recommender.service';

@Component({
  selector: 'app-profile',
  imports: [TranslateModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  protected savedCollections = signal<SavedCollection[]>([]);
  protected isLoading = signal(true);
  protected errorMessage = signal('');
  protected deletingModuleId = signal<number | null>(null);
  protected deletingCollectionId = signal<string | null>(null);

  constructor(
    private recommenderService: RecommenderService,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadSavedModules();
  }

  private loadSavedModules(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.recommenderService.getSavedRecommendations().subscribe({
      next: (collections) => {
        this.savedCollections.set(collections);
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

  protected removeModule(collectionId: string, moduleId: number, event: Event): void {
    event.stopPropagation();

    const collection = this.savedCollections().find(c => c._id === collectionId);
    if (!collection) return;

    // If this is the last module in the collection, delete the entire collection
    if (collection.items.length === 1) {
      this.deleteCollection(collectionId, event);
      return;
    }

    if (!confirm('Weet je zeker dat je deze module wilt verwijderen?')) {
      return;
    }

    this.deletingModuleId.set(moduleId);

    this.recommenderService.deleteModule(collectionId, moduleId).subscribe({
      next: (response) => {
        if (response.status) {
          // Update local state by removing the module from the collection
          const updatedCollections = this.savedCollections().map(col => {
            if (col._id === collectionId) {
              return {
                ...col,
                items: col.items.filter(item => item.id !== moduleId)
              };
            }
            return col;
          });
          this.savedCollections.set(updatedCollections);
        } else {
          this.errorMessage.set(response.message || 'Fout bij het verwijderen van de module');
        }
        this.deletingModuleId.set(null);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het verwijderen van de module');
        this.deletingModuleId.set(null);
      }
    });
  }

  protected deleteCollection(collectionId: string, event: Event): void {
    event.stopPropagation();

    if (!confirm('Weet je zeker dat je deze hele collectie wilt verwijderen?')) {
      return;
    }

    this.deletingCollectionId.set(collectionId);

    this.recommenderService.deleteCollection(collectionId).subscribe({
      next: (response) => {
        if (response.status) {
          // Update local state by removing the collection
          const updatedCollections = this.savedCollections().filter(col => col._id !== collectionId);
          this.savedCollections.set(updatedCollections);
        } else {
          this.errorMessage.set(response.message || 'Fout bij het verwijderen van de collectie');
        }
        this.deletingCollectionId.set(null);
      },
      error: (error) => {
        this.errorMessage.set(error.errorMessage || 'Fout bij het verwijderen van de collectie');
        this.deletingCollectionId.set(null);
      }
    });
  }

  protected getTotalModules(): number {
    return this.savedCollections().reduce((total, collection) => total + collection.items.length, 0);
  }

  protected browseModules(): void {
    this.router.navigate(['/modules']);
  }

  protected formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
