import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, of, shareReplay, tap, throwError } from 'rxjs';

export interface Fiok {
  id: number;
  nev: string;
  email: string;
}

export interface RegisztraciosAdatok {
  nev: string;
  email: string;
  jelszo: string;
  szerepkor: string;
  tantargy: string[];
  tanulasi_cel?: string[];
  vegzettseg?: string[];
}

@Injectable({ providedIn: 'root' })
export class FiokService {
  private readonly http = inject(HttpClient);
  private readonly api = '/api/auth';
  private readonly aktualisFiok = signal<Fiok | null>(null);
  readonly fiok = this.aktualisFiok.asReadonly();
  private readonly kezdoAllapot = this.http.get<{ data: Fiok }>(`${this.api}/profil`).pipe(
    tap(({ data }) => this.aktualisFiok.set(data)),
    catchError((hiba: HttpErrorResponse) => {
      if (hiba.status === 401) return of(null);
      return throwError(() => hiba);
    }),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  allapotBetoltese() {
    return this.kezdoAllapot;
  }

  regisztracio(adatok: RegisztraciosAdatok) {
    return this.http.post<{ data: Fiok }>(`${this.api}/regisztracio`, adatok);
  }

  bejelentkezes(email: string, jelszo: string) {
    return this.http.post<{ data: Fiok }>(`${this.api}/bejelentkezes`, { email, jelszo }).pipe(
      tap(({ data }) => this.aktualisFiok.set(data)),
    );
  }

  profil() {
    return this.http.get<{ data: Fiok }>(`${this.api}/profil`).pipe(
      tap(({ data }) => this.aktualisFiok.set(data)),
      catchError((hiba: HttpErrorResponse) => {
        if (hiba.status === 401) this.aktualisFiok.set(null);
        return throwError(() => hiba);
      }),
    );
  }

  kijelentkezes() {
    return this.http.post<void>(`${this.api}/kijelentkezes`, {}).pipe(
      tap(() => this.aktualisFiok.set(null)),
    );
  }
}

export function fiokHibauzenet(hiba: unknown): string {
  if (hiba instanceof HttpErrorResponse && typeof hiba.error?.error === 'string') {
    return hiba.error.error;
  }
  return 'A művelet most nem sikerült. Próbáld újra.';
}
