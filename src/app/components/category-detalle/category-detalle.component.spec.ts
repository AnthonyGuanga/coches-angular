import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetalleComponent } from './category-detalle.component';

describe('CategoryDetalleComponent', () => {
  let component: CategoryDetalleComponent;
  let fixture: ComponentFixture<CategoryDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
