import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Profil } from './profil';

describe('Profil', () => {
  let component: Profil;
  let fixture: ComponentFixture<Profil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profil],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Profil);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const http = TestBed.inject(HttpTestingController);
    http.expectOne({ method: 'GET', url: '/api/auth/profil' }).flush({
      data: { id: 1, nev: 'Teszt Diák', email: 'teszt@example.com' },
    });
    await fixture.whenStable();
    http.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the name and email returned by the API', () => {
    const page: HTMLElement = fixture.nativeElement;
    expect(page.querySelector('dl')?.textContent).toContain('Teszt Diák');
    expect(page.querySelector('dl')?.textContent).toContain('teszt@example.com');
  });
});
