import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, take } from 'rxjs';

import { register } from 'swiper/element/bundle';
import { CochesService, Coche } from '../../services/coches.service';
import { AuthService } from '../../services/auth.service';

// --- IMPORTACIONES DE ANGULAR MATERIAL ---
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button'; // 👈 Necesario para mat-flat-button
import { MatIconModule } from '@angular/material/icon';     // 👈 Necesario para mat-icon
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para el spinner de carga

register();

@Component({
  selector: 'app-coche-detalle',
  standalone: true,
  // Agregamos los módulos de Material aquí para que el HTML los reconozca
  imports: [
    CommonModule, 
    MatTableModule, 
    RouterModule, 
    MatButtonModule, 
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './coche-detalle.component.html',
  styleUrl: './coche-detalle.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CategoryDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cochesService = inject(CochesService);
  public authService = inject(AuthService);

  coche$!: Observable<Coche | undefined>;

  ngOnInit() {
    this.coche$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') || '';
        return this.cochesService.getCocheById(id);
      })
    );
  }

  ejecutarReserva(idCoche: string) {
    this.authService.appUser$.pipe(take(1)).subscribe(async (user) => {
      if (user) {
        try {
          await this.cochesService.reservarCoche(idCoche, user.uid);
          alert('¡Coche reservado con éxito!');
        } catch (error) {
          console.error('Error al realizar la reserva:', error);
          alert('Hubo un error al procesar tu reserva.');
        }
      }
    });
  }
}