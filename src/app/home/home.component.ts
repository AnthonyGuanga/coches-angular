import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { CochesService, Coche } from '../services/coches.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  coches$!: Observable<Coche[]>;
  categoriaSeleccionada: string | null = null; // Variable para saber qué filtro está activo

  bannerImages = [
    {
      img: 'https://mlin.es/wp-content/uploads/2024/08/marcas-de-coches-de-lujo-poco-conocidas-1024x626.jpg',
      title: '1',
    },
    {
      img: 'https://mlin.es/wp-content/uploads/2024/08/Marcas-raras-de-coches-pagani-1024x576.webp',
      title: '2',
    },
    {
      img: 'https://mlin.es/wp-content/uploads/2024/08/Koenigsegg-super-marca-de-lujo-de-coches.jpg',
      title: '3',
    },
  ];

  constructor(private cochesService: CochesService) {
    // Ya no necesitamos inyectar Firestore aquí, el servicio se encarga.
  }

  ngOnInit(): void {
    this.cargarCoches();
  }

  // 1. Función que recibe el click desde el HTML
  filtrarPorTipo(tipo: string) {
    // Toggle: Si pulso el mismo que ya está activo, lo desactivo (null)
    if (this.categoriaSeleccionada === tipo) {
      this.categoriaSeleccionada = null;
    } else {
      this.categoriaSeleccionada = tipo;
    }

    // Volvemos a pedir los datos al servicio con el nuevo filtro
    this.cargarCoches();
  }

  // 2. Lógica simplificada: El servicio hace todo el trabajo sucio
  cargarCoches() {
    this.coches$ = this.cochesService.getCoches(this.categoriaSeleccionada);
  }
}
