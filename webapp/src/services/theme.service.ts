import { Injectable, signal, effect, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'theme-preference';
  private isBrowser: boolean;

  isDarkMode = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.initializeTheme();

      effect(() => {
        this.applyTheme(this.isDarkMode());
      });
    }
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);

    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.THEME_KEY)) {
        this.isDarkMode.set(e.matches);
      }
    });
  }

  private applyTheme(isDark: boolean): void {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  toggleTheme(): void {
    const newValue = !this.isDarkMode();
    this.isDarkMode.set(newValue);
    if (this.isBrowser) {
      localStorage.setItem(this.THEME_KEY, newValue ? 'dark' : 'light');
    }
  }

  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    if (this.isBrowser) {
      localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    }
  }
}
