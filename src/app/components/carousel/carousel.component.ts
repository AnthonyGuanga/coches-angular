import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';

// Registrar Swiper
register();

@Component({
  selector: 'app-carousel',
  imports: [],// Está vacío porque usamos la sintaxis moderna @if/@for
  // Esto permite usar etiquetas "inventadas" como <swiper-container>
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  //schemas: [CUSTOM_ELEMENTS_SCHEMA]: Angular es muy estricto y si ve etiquetas que no conoce, da error. Esta línea le dice a Angular: 
  //"Relájate, voy a usar etiquetas externas (Web Components), no te preocupes por validar todo".
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  host: { 'ngSkipHydration': 'true' }
})


export class CarouselComponent {
  // Aquí está la magia: @Input permite recibir datos desde fuera
  @Input() slides: { img: string; title?: string }[] = [];
}
