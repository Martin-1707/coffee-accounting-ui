import { effect, Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'theme:dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private _isDark = signal<boolean>(false);
  isDark = this._isDark.asReadonly();

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this._isDark.set(saved === '1');
    effect(() => this.apply());
  }

  toggle() {
    this._isDark.update(v => !v);
    localStorage.setItem(STORAGE_KEY, this._isDark() ? '1' : '0');
  }

  private apply() {
    const root = document.documentElement;
    if (this._isDark()) root.classList.add('dark');
    else root.classList.remove('dark');
  }
}