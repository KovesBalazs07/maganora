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
});
