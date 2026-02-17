import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CocheComponent } from './coche.component';

describe('CocheComponent', () => {
  let component: CocheComponent;
  let fixture: ComponentFixture<CocheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CocheComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CocheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
