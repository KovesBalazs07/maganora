import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { FiokService, fiokHibauzenet } from '../fiok.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-bejelentkezes',
  templateUrl: './bejelentkezes.html',
})
export class Bejelentkezes {
  private readonly fiok = inject(FiokService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly hiba = signal('');
  protected readonly kuldes = signal(false);
  protected readonly urlap = inject(NonNullableFormBuilder).group({
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    jelszo: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
  });

  protected belepes(): void {
    if (this.kuldes()) return;
    if (this.urlap.invalid) {
      this.hiba.set('Adj meg érvényes e-mail-címet és 8–128 karakteres jelszót.');
      return;
    }

    this.hiba.set('');
    this.kuldes.set(true);
    const { email, jelszo } = this.urlap.getRawValue();
    this.fiok.bejelentkezes(email, jelszo).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.kuldes.set(false)),
    ).subscribe({
      next: () => void this.router.navigate(['/fooldal']),
      error: (hiba: unknown) => this.hiba.set(fiokHibauzenet(hiba)),
    });
  }
}
