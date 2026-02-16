import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-carousel',
  standalone: true, // Angular 17+ suele ser standalone por defecto, pero es bueno ser explícito
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  // ngSkipHydration ayuda si usas SSR (Server Side Rendering) para evitar conflictos con el DOM de Swiper
  host: { 'ngSkipHydration': 'true' }
})
export class CarouselComponent {
  @Input() slides: { img: string; title?: string }[] = [];
}