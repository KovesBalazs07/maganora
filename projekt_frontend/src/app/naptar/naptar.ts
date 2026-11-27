import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-naptar',
  templateUrl: './naptar.html',
  styleUrl: './naptar.css',
})
export class Naptar {
  private readonly ma = new Date();
  protected readonly honap = signal(new Date(this.ma.getFullYear(), this.ma.getMonth(), 1));
  protected readonly kivalasztottDatum = signal<Date | null>(null);
  protected readonly napnevek = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'];
  protected readonly honapNeve = computed(() =>
    new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long' }).format(this.honap()),
  );
  protected readonly napok = computed(() => {
    const datum = this.honap();
    const elsoNap = (datum.getDay() + 6) % 7;
    const napokSzama = new Date(datum.getFullYear(), datum.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: elsoNap }, () => null),
      ...Array.from({ length: napokSzama }, (_, index) => index + 1),
    ];
  });

  protected honapotValt(eltolas: number): void {
    const datum = this.honap();
    this.honap.set(new Date(datum.getFullYear(), datum.getMonth() + eltolas, 1));
  }

  protected napotValaszt(nap: number): void {
    const datum = this.honap();
    this.kivalasztottDatum.set(new Date(datum.getFullYear(), datum.getMonth(), nap));
  }

  protected kivalasztottNap(nap: number): boolean {
    const kivalasztott = this.kivalasztottDatum();
    const datum = this.honap();
    return kivalasztott !== null && kivalasztott.getDate() === nap &&
      kivalasztott.getMonth() === datum.getMonth() && kivalasztott.getFullYear() === datum.getFullYear();
  }

  protected maiNap(nap: number | null): boolean {
    const datum = this.honap();
    return nap === this.ma.getDate() && datum.getMonth() === this.ma.getMonth() &&
      datum.getFullYear() === this.ma.getFullYear();
  }
}
