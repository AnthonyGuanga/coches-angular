import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarTypeCardComponent } from './car-type-card.component';

describe('CarTypeCardComponent', () => {
  let component: CarTypeCardComponent;
  let fixture: ComponentFixture<CarTypeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarTypeCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarTypeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
