import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagenModalComponent } from './imagen.component';

describe('ImagenComponent', () => {
  let component: ImagenModalComponent;
  let fixture: ComponentFixture<ImagenModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImagenModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImagenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
