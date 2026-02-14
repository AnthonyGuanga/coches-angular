import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarouselComponent } from '../components/carousel/carousel.component';
import { CochesService, Coche } from '../services/coches.service';
import { Observable, map } from 'rxjs';
import { CarTypeCardComponent } from '../components/car-type-card/car-type-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent, CommonModule, RouterModule, CarTypeCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  coches$!: Observable<Coche[]>;
  categoriaSeleccionada: (typeof this.tiposCoche[number]['id']) | null = null;
  carouselSlides: { img: string; title?: string }[] = [];


  tiposCoche = [
    { id: 'SUV', label: 'SUV', icon: 'suv' },
    { id: 'monovolumen', label: 'Monovolumen', icon: 'monovolumen' },
    { id: 'familiar', label: 'Familiar', icon: 'familiar' },
    { id: 'coupé', label: 'coupé', icon: 'coupé' },
    { id: 'furgoneta', label: 'furgoneta', icon: 'furgoneta' },
    { id: 'sedán', label: 'sedán', icon: 'sedán' },
    { id: 'hatchback', label: 'hatchback', icon: 'hatchback' },
  ];


  filtrarPorTipo(tipo: string) {
    this.categoriaSeleccionada = this.categoriaSeleccionada === tipo ? null : tipo;
    this.cargarCoches();
  }

  constructor(private cochesService: CochesService) {
    // Ya no necesitamos inyectar Firestore aquí, el servicio se encarga.
  }

  ngOnInit(): void {
    this.cargarCoches();
    this.cargarCarrusel();
  }

  cargarCoches() {
    this.coches$ = this.cochesService.getCoches(this.categoriaSeleccionada).pipe(
      map(coches => {
        // Filtramos solo coches desde 2020
        return coches.filter(c => Number(c.anio) >= 2023);
      })
    );
  }

  cargarCarrusel() {
    this.cochesService.getCoches(null).subscribe(coches => {

      const slides = coches
        .filter(c => !!c.fotoPrincipal)
        .map(coche => ({
          img: coche.fotoPrincipal!,
          title: `${coche.marca ?? ''} ${coche.modelo ?? ''}`.trim()
        }));

      this.carouselSlides = this.shuffle(slides).slice(0, 3);
    });
  }

  private shuffle<T>(array: T[]): T[] {
    return array
      .map(v => ({ v, r: Math.random() }))
      .sort((a, b) => a.r - b.r)
      .map(({ v }) => v);
  }
}
