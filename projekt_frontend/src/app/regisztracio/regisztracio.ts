import { Component, DestroyRef, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { catchError, finalize, switchMap, throwError } from 'rxjs';
import { FiokService, fiokHibauzenet } from '../fiok.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-regisztracio',
  templateUrl: './regisztracio.html',
})
export class Regisztracio {
  private readonly fiok = inject(FiokService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly hiba = signal('');
  protected readonly kuldes = signal(false);
  protected readonly tantargyak = [
    ['matematika', 'Matematika'], ['fizika', 'Fizika'], ['kemia', 'Kémia'],
    ['informatika', 'Informatika'], ['magyar', 'Magyar nyelv és irodalom'],
    ['tortenelem', 'Történelem'], ['angol', 'Angol'], ['nemet', 'Német'], ['egyeb', 'Egyéb'],
  ];
  protected readonly celok = [
    ['felzarkoztatas', 'Felzárkóztatás és gyakorlás'], ['felveteli', 'Felvételi'],
    ['erettsegi', 'Érettségi'], ['emelt_erettsegi', 'Emelt szintű érettségi'],
    ['egyetem', 'Egyetemi tanulmányok'], ['egyeb', 'Egyéb'],
  ];
  protected readonly vegzettsegek = [
    ['erettsegi', 'Érettségi'], ['folyamatban_levo_felsooktatasi', 'Folyamatban lévő felsőfokú tanulmányok'],
    ['alapkepzes', 'Alapképzés'], ['mesterkepzes', 'Mesterképzés'],
    ['tanari_diploma', 'Tanári diploma'], ['doktori', 'Doktori fokozat'], ['egyeb', 'Egyéb'],
  ];
  protected readonly urlap = inject(NonNullableFormBuilder).group({
    nev: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    jelszo: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(128)]],
    szerepkor: ['', Validators.required],
    tantargy: [[] as string[], Validators.required],
    tanulasi_cel: [[] as string[]],
    vegzettseg: [[] as string[]],
  });

  protected valasztas(mezo: 'tantargy' | 'tanulasi_cel' | 'vegzettseg', ertek: string, kivalasztva: boolean): void {
    const control = this.urlap.controls[mezo];
    control.setValue(kivalasztva ? [...control.value, ertek] : control.value.filter(item => item !== ertek));
  }

  protected regisztral(): void {
    if (this.kuldes()) return;
    const { nev, email, jelszo, szerepkor, tantargy, tanulasi_cel, vegzettseg } = this.urlap.getRawValue();
    if (this.urlap.invalid || !nev.trim() ||
        (szerepkor === 'diak' && !tanulasi_cel.length) || (szerepkor === 'tanar' && !vegzettseg.length)) {
      this.hiba.set('Töltsd ki a nevet, e-mail-címet, jelszót és a szerepkörhöz tartozó mezőket.');
      return;
    }

    this.hiba.set('');
    this.kuldes.set(true);
    this.fiok.regisztracio({
      nev, email, jelszo, szerepkor, tantargy,
      ...(szerepkor === 'diak' ? { tanulasi_cel } : { vegzettseg }),
    }).pipe(
      switchMap(() => this.fiok.bejelentkezes(email, jelszo).pipe(
        catchError(() => throwError(() => new Error('A regisztráció sikerült, de a bejelentkezés nem. Jelentkezz be a létrehozott fiókoddal.'))),
      )),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.kuldes.set(false)),
    ).subscribe({
      next: () => void this.router.navigate(['/fooldal']),
      error: (hiba: unknown) => this.hiba.set(hiba instanceof Error && !(hiba instanceof HttpErrorResponse) ? hiba.message : fiokHibauzenet(hiba)),
    });
  }
}
