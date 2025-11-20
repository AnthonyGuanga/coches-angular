import { Component, OnInit } from '@angular/core'; // Importamos OnInit
import { CommonModule } from '@angular/common'; // ¡Añadimos CommonModule para *ngFor y pipes!
import { CarouselComponent } from '../components/carousel/carousel.component';
import { CochesService, Coche } from '../services/coches.service'; // Importamos el Servicio y la Interfaz
import { Observable } from 'rxjs'; // Importamos Observable

@Component({
  selector: 'app-home',
  standalone: true,
  // ¡IMPORTANTE! Añadir CommonModule
  imports: [CarouselComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit { // Implementamos OnInit
  
  // Variable donde se guardará el flujo de datos de los coches (Observable)
  coches$!: Observable<Coche[]>; 

  // Datos existentes para la portada (pueden quedarse)
  bannerImages = [
    { img: 'https://mlin.es/wp-content/uploads/2024/08/marcas-de-coches-de-lujo-poco-conocidas-1024x626.jpg', title: '1' },
    { img: 'https://mlin.es/wp-content/uploads/2024/08/Marcas-raras-de-coches-pagani-1024x576.webp', title: '2' },
    { img: 'https://mlin.es/wp-content/uploads/2024/08/Koenigsegg-super-marca-de-lujo-de-coches.jpg', title: '3' },
  ];

  // Inyectamos el CochesService
  constructor(private cochesService: CochesService) {}

  ngOnInit(): void {
    // Cuando el componente está listo, solicitamos la lista de coches
    this.coches$ = this.cochesService.getCoches();
  }
}