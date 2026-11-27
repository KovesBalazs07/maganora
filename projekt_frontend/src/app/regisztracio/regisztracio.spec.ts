import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { FiokService } from '../fiok.service';
import { Regisztracio } from './regisztracio';

describe('Regisztracio', () => {
  let component: Regisztracio;
  let fixture: ComponentFixture<Regisztracio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Regisztracio],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Regisztracio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('signs the new user in and returns to the home page', async () => {
    const page: HTMLElement = fixture.nativeElement;
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    for (const [id, value] of [
      ['regisztracio-nev', 'Teszt Diák'],
      ['regisztracio-email', 'teszt@example.com'],
      ['regisztracio-jelszo', 'teszt-jelszo'],
    ]) {
      const input = page.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    const szerepkor = page.querySelector<HTMLSelectElement>('#szerepkor')!;
    szerepkor.value = 'diak';
    szerepkor.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    for (const index of [0, 1, 10]) {
      const checkbox = page.querySelectorAll<HTMLInputElement>('.tobbvalaszto input')[index];
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));
    }
    page.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    const http = TestBed.inject(HttpTestingController);
    const data = { id: 1, nev: 'Teszt Diák', email: 'teszt@example.com' };
    const registration = http.expectOne('/api/auth/regisztracio');
    expect(registration.request.body).toEqual({
      nev: 'Teszt Diák', email: 'teszt@example.com', jelszo: 'teszt-jelszo',
      szerepkor: 'diak', tantargy: ['matematika', 'fizika'], tanulasi_cel: ['felveteli'],
    });
    registration.flush({ data });
    const login = http.expectOne('/api/auth/bejelentkezes');
    expect(login.request.body).toEqual({ email: 'teszt@example.com', jelszo: 'teszt-jelszo' });
    login.flush({ data });
    expect(TestBed.inject(FiokService).fiok()).toEqual(data);
    expect(navigate).toHaveBeenCalledWith(['/fooldal']);
    http.verify();
  });
});
