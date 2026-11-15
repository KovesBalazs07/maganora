import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Fooldal } from './fooldal';

describe('Fooldal', () => {
  let component: Fooldal;
  let fixture: ComponentFixture<Fooldal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fooldal],
    }).compileComponents();

    fixture = TestBed.createComponent(Fooldal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
