import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { finalize } from 'rxjs';
import { FiokService, fiokHibauzenet } from './fiok.service';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly fiok = inject(FiokService);
  private readonly router = inject(Router);
  protected readonly betoltes = signal(true);
  protected readonly kijelentkezesFolyamatban = signal(false);
  protected readonly hiba = signal('');

  constructor() {
    this.fiok.allapotBetoltese().pipe(finalize(() => this.betoltes.set(false))).subscribe({
      error: (hiba: unknown) => this.hiba.set(fiokHibauzenet(hiba)),
    });
  }

  protected kijelentkezes(): void {
    if (this.kijelentkezesFolyamatban()) return;
    this.hiba.set('');
    this.kijelentkezesFolyamatban.set(true);
    this.fiok.kijelentkezes().pipe(finalize(() => this.kijelentkezesFolyamatban.set(false))).subscribe({
      next: () => void this.router.navigate(['/fooldal']),
      error: (hiba: unknown) => this.hiba.set(fiokHibauzenet(hiba)),
    });
  }
}
