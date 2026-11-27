import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Fiok, FiokService, fiokHibauzenet } from '../fiok.service';

@Component({
  imports: [RouterLink],
  selector: 'app-profil',
  templateUrl: './profil.html',
})
export class Profil implements OnInit {
  private readonly fiok = inject(FiokService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly profil = signal<Fiok | null>(null);
  protected readonly betoltes = signal(true);
  protected readonly kijelentkezesFolyamatban = signal(false);
  protected readonly bejelentkezesSzukseges = signal(false);
  protected readonly hiba = signal('');

  ngOnInit(): void {
    this.fiok.profil().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.betoltes.set(false)),
    ).subscribe({
      next: ({ data }) => this.profil.set(data),
      error: (hiba: unknown) => {
        this.bejelentkezesSzukseges.set(hiba instanceof HttpErrorResponse && hiba.status === 401);
        this.hiba.set(fiokHibauzenet(hiba));
      },
    });
  }

  protected kijelentkezes(): void {
    if (this.kijelentkezesFolyamatban()) return;
    this.hiba.set('');
    this.kijelentkezesFolyamatban.set(true);
    this.fiok.kijelentkezes().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.kijelentkezesFolyamatban.set(false)),
    ).subscribe({
      next: () => {
        this.profil.set(null);
        void this.router.navigate(['/bejelentkezes']);
      },
      error: (hiba: unknown) => this.hiba.set(fiokHibauzenet(hiba)),
    });
  }
}
