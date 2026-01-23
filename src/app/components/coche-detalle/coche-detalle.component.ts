import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, map, switchMap } from 'rxjs';

import { register } from 'swiper/element/bundle';
import { CochesService, Coche } from '../../services/coches.service';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
register();

@Component({
  selector: 'app-coche-detalle',
  standalone: true,
  imports: [CommonModule, MatTableModule, RouterModule],
  templateUrl: './coche-detalle.component.html',
  styleUrl: './coche-detalle.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cochesService = inject(CochesService);

  coche$!: Observable<Coche | undefined>;

  ngOnInit() {
    this.coche$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') || '';
        return this.cochesService.getCocheById(id);
      })
    );
  }
}
