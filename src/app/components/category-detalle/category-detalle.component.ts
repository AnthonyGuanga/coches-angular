import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, map, switchMap } from 'rxjs';

import { register } from 'swiper/element/bundle';
import { CochesService, Coche } from '../../services/coches.service';

register();

@Component({
  selector: 'app-category-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-detalle.component.html',
  styleUrl: './category-detalle.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryDetalleComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private cochesService = inject(CochesService);

  coche$!: Observable<Coche | null>;
  fotos$!: Observable<string[]>;

  ngOnInit(): void {

    this.coche$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.cochesService.getCoches().pipe(
          map(coches => coches.find(c => c.id === id) || null)
        );
      })
    );

    this.fotos$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id')!;
        return this.cochesService.getCoches().pipe(
          map(coches => coches.find(c => c.id === id)?.fotos ?? [])
        );
      })
    );


  }

}
