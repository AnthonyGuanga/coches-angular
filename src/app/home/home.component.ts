import { Component } from '@angular/core';
import { CarouselComponent } from '../components/carousel/carousel.component'; // Importas tu hijo
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  // Datos para la portada
  bannerImages = [
    { img: 'https://mlin.es/wp-content/uploads/2024/08/marcas-de-coches-de-lujo-poco-conocidas-1024x626.jpg', title: '1' },
    { img: 'https://mlin.es/wp-content/uploads/2024/08/Marcas-raras-de-coches-pagani-1024x576.webp', title: '2' },
    { img: 'https://mlin.es/wp-content/uploads/2024/08/Koenigsegg-super-marca-de-lujo-de-coches.jpg', title: '3' },
  ];
}
