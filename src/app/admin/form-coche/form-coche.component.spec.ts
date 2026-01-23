import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCocheComponent } from './form-coche.component';

describe('FormCocheComponent', () => {
  let component: FormCocheComponent;
  let fixture: ComponentFixture<FormCocheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCocheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCocheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
