import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosGarantiaComponent } from './servicios-garantia.component';

describe('ServiciosGarantiaComponent', () => {
  let component: ServiciosGarantiaComponent;
  let fixture: ComponentFixture<ServiciosGarantiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosGarantiaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosGarantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
