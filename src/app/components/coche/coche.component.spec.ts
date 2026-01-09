import { ComponentFixture, TestBed } from '@angular/core/testing';

import { cocheComponent } from './coche.component';

describe('cocheComponent', () => {
  let component: cocheComponent;
  let fixture: ComponentFixture<cocheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [cocheComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(cocheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
