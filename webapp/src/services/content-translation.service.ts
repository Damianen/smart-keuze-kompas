import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, from, firstValueFrom } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { LanguageService } from './language.service';
import { KeuzeModule } from '../dtos/module.dto';
import { ApiConfig } from '../utils/api-config';

interface TranslationCache {
  [key: string]: KeuzeModule;
}

interface TranslationResponse {
  original: string;
  translated: string;
  from: string;
  to: string;
}

interface BatchTranslationResponse {
  translations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ContentTranslationService {
  private cache: TranslationCache = {};
  private readonly CACHE_KEY = 'module-translations-cache-v3';
  private isBrowser: boolean;
  private apiUrl = `${ApiConfig.getApiUrl()}/api/translation`;

  constructor(
    private languageService: LanguageService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage(): void {
    if (this.isBrowser) {
      try {
        const cached = localStorage.getItem(this.CACHE_KEY);
        if (cached) {
          this.cache = JSON.parse(cached);
        }
      } catch {
        this.cache = {};
      }
    }
  }

  private saveCacheToStorage(): void {
    if (this.isBrowser) {
      try {
        localStorage.setItem(this.CACHE_KEY, JSON.stringify(this.cache));
      } catch {
        // Storage full or unavailable
      }
    }
  }

  private getCacheKey(moduleId: number): string {
    return `module_${moduleId}_en`;
  }

  private async translateText(text: string): Promise<string> {
    if (!text || text.trim() === '') {
      return text;
    }
    try {
      const response = await firstValueFrom(
        this.http.post<TranslationResponse>(`${this.apiUrl}/translate`, {
          text,
          from: 'nl',
          to: 'en'
        }, { withCredentials: true })
      );
      return response.translated;
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  translateModule(module: KeuzeModule): Observable<KeuzeModule> {
    if (this.languageService.currentLanguage() === 'nl') {
      return of(module);
    }

    // Check cache
    const cacheKey = this.getCacheKey(module.id);
    if (this.cache[cacheKey]) {
      return of(this.cache[cacheKey]);
    }

    // Translate using backend API
    return from(this.translateModuleAsync(module)).pipe(
      tap(translated => {
        this.cache[cacheKey] = translated;
        this.saveCacheToStorage();
      }),
      catchError((error) => {
        console.error('Translation error:', error);
        return of(module);
      })
    );
  }

  private async translateModuleAsync(module: KeuzeModule): Promise<KeuzeModule> {
    const texts = [
      module.name,
      module.shortdescription || '',
      module.description || '',
      module.content || '',
      module.learningoutcomes || ''
    ];

    try {
      const response = await firstValueFrom(
        this.http.post<BatchTranslationResponse>(`${this.apiUrl}/translate-batch`, {
          texts,
          from: 'nl',
          to: 'en'
        }, { withCredentials: true })
      );

      const [name, shortdescription, description, content, learningoutcomes] = response.translations;

      return {
        ...module,
        name,
        shortdescription,
        description,
        content,
        learningoutcomes
      };
    } catch (error) {
      console.error('Batch translation error:', error);
      return module;
    }
  }

  translateModules(modules: KeuzeModule[]): Observable<KeuzeModule[]> {
    if (this.languageService.currentLanguage() === 'nl') {
      return of(modules);
    }

    if (modules.length === 0) {
      return of([]);
    }

    return from(this.translateModulesAsync(modules));
  }

  private async translateModulesAsync(modules: KeuzeModule[]): Promise<KeuzeModule[]> {
    const results: KeuzeModule[] = [];

    for (const module of modules) {
      const cacheKey = this.getCacheKey(module.id);
      if (this.cache[cacheKey]) {
        results.push(this.cache[cacheKey]);
      } else {
        try {
          const translated = await this.translateModuleAsync(module);
          this.cache[cacheKey] = translated;
          results.push(translated);
        } catch {
          results.push(module);
        }
      }
    }

    this.saveCacheToStorage();
    return results;
  }

  needsTranslation(): boolean {
    return this.languageService.currentLanguage() === 'en';
  }

  clearCache(): void {
    this.cache = {};
    if (this.isBrowser) {
      localStorage.removeItem(this.CACHE_KEY);
    }
  }
}
