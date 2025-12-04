import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 1. IMPORTAR ESTO
import { CarouselComponent } from '../components/carousel/carousel.component';
import { CochesService, Coche } from '../services/coches.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  // 👇 2. AGREGARLO AQUÍ AL ARRAY DE IMPORTS
  imports: [CarouselComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  coches$!: Observable<Coche[]>;

  bannerImages = [
    { img: 'https://mlin.es/wp-content/uploads/2024/08/marcas-de-coches-de-lujo-poco-conocidas-1024x626.jpg', title: '1' },
    { img: 'https://mlin.es/wp-content/uploads/2024/08/Marcas-raras-de-coches-pagani-1024x576.webp', title: '2' },
    { img: 'https://mlin.es/wp-content/uploads/2024/08/Koenigsegg-super-marca-de-lujo-de-coches.jpg', title: '3' },
  ];

  constructor(private cochesService: CochesService) { }

  ngOnInit(): void {
    this.coches$ = this.cochesService.getCoches();
  }
}