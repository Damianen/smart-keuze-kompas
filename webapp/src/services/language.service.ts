import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'nl' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly LANGUAGE_KEY = 'language-preference';
  private readonly DEFAULT_LANGUAGE: Language = 'nl';
  private readonly SUPPORTED_LANGUAGES: Language[] = ['nl', 'en'];
  private isBrowser: boolean;

  currentLanguage = signal<Language>(this.DEFAULT_LANGUAGE);

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private translate: TranslateService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.translate.addLangs(this.SUPPORTED_LANGUAGES);
    this.translate.setDefaultLang(this.DEFAULT_LANGUAGE);

    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    let language: Language = this.DEFAULT_LANGUAGE;

    if (this.isBrowser) {
      const savedLanguage = localStorage.getItem(this.LANGUAGE_KEY) as Language | null;

      if (savedLanguage && this.SUPPORTED_LANGUAGES.includes(savedLanguage)) {
        language = savedLanguage;
      } else {
        const browserLang = this.translate.getBrowserLang();
        if (browserLang && this.SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
          language = browserLang as Language;
        }
      }
    }

    this.currentLanguage.set(language);
    this.translate.use(language);

    if (this.isBrowser) {
      document.documentElement.lang = language;
    }
  }

  toggleLanguage(): void {
    const newLanguage: Language = this.currentLanguage() === 'nl' ? 'en' : 'nl';
    this.setLanguage(newLanguage);
  }

  setLanguage(language: Language): void {
    if (!this.SUPPORTED_LANGUAGES.includes(language)) {
      return;
    }

    this.currentLanguage.set(language);
    this.translate.use(language);

    if (this.isBrowser) {
      localStorage.setItem(this.LANGUAGE_KEY, language);
      document.documentElement.lang = language;
    }
  }

  getLanguageLabel(language: Language): string {
    return language === 'nl' ? 'Nederlands' : 'English';
  }

  getCurrentLanguageLabel(): string {
    return this.getLanguageLabel(this.currentLanguage());
  }
}
