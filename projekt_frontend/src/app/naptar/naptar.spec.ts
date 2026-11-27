import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Naptar } from './naptar';

describe('Naptar', () => {
  let component: Naptar;
  let fixture: ComponentFixture<Naptar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Naptar],
    }).compileComponents();

    fixture = TestBed.createComponent(Naptar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('allows moving between months', async () => {
    const page: HTMLElement = fixture.nativeElement;
    const eredeti = page.querySelector('h2')?.textContent;
    page.querySelector<HTMLButtonElement>('[aria-label="Következő hónap"]')!.click();
    await fixture.whenStable();
    expect(page.querySelector('h2')?.textContent).not.toBe(eredeti);
    page.querySelector<HTMLButtonElement>('[aria-label="Előző hónap"]')!.click();
    await fixture.whenStable();
    expect(page.querySelector('h2')?.textContent).toBe(eredeti);
  });

  it('selects a day and keeps the selection when navigating between months', async () => {
    const page: HTMLElement = fixture.nativeElement;
    const day = page.querySelector<HTMLButtonElement>('button.nap')!;
    day.click();
    await fixture.whenStable();
    expect(day.getAttribute('aria-pressed')).toBe('true');
    page.querySelector<HTMLButtonElement>('[aria-label="Következő hónap"]')!.click();
    await fixture.whenStable();
    expect(page.querySelector('button.nap[aria-pressed="true"]')).toBeNull();
    page.querySelector<HTMLButtonElement>('[aria-label="Előző hónap"]')!.click();
    await fixture.whenStable();
    expect(page.querySelector('button.nap[aria-pressed="true"]')).toBeTruthy();
  });
});
