import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Bejelentkezes } from './bejelentkezes';

describe('Bejelentkezes', () => {
  let component: Bejelentkezes;
  let fixture: ComponentFixture<Bejelentkezes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bejelentkezes],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Bejelentkezes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('submits the credentials and shows the API error for an invalid password', async () => {
    const page: HTMLElement = fixture.nativeElement;
    for (const [id, value] of [
      ['belepes-email', 'teszt@example.com'],
      ['belepes-jelszo', 'hibas-jelszo'],
    ]) {
      const input = page.querySelector<HTMLInputElement>(`#${id}`)!;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    page.querySelector('form')!.dispatchEvent(new Event('submit', { cancelable: true }));
    const http = TestBed.inject(HttpTestingController);
    const request = http.expectOne({ method: 'POST', url: '/api/auth/bejelentkezes' });
    expect(request.request.body).toEqual({ email: 'teszt@example.com', jelszo: 'hibas-jelszo' });
    request.flush({ error: 'Hibás e-mail-cím vagy jelszó.' }, { status: 401, statusText: 'Unauthorized' });
    await fixture.whenStable();
    expect(page.querySelector('[role="alert"]')?.textContent).toContain('Hibás e-mail-cím vagy jelszó.');
    http.verify();
  });
});
