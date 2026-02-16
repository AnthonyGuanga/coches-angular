import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable, switchMap, map, take, of } from 'rxjs';
import { Router } from '@angular/router';
import { register } from 'swiper/element/bundle';
import { CochesService, Coche } from '../../services/coches.service';
import { AuthService } from '../../services/auth.service';

// --- IMPORTACIONES DE ANGULAR MATERIAL ---
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button'; // 👈 Necesario para mat-flat-button
import { MatIconModule } from '@angular/material/icon';     // 👈 Necesario para mat-icon
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // Para el spinner de carga
import { MatDialog } from '@angular/material/dialog'; // Para abrir el modal de imagen
import { ImagenModalComponent } from '../imagen/imagen.component';

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
  private router = inject(Router);
  private cochesService = inject(CochesService);
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);

  coche$!: Observable<Coche & { reservadorNombre?: string }>;

  ngOnInit() {
    this.coche$ = this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') || '';
        return this.cochesService.getCocheById(id).pipe(
          switchMap(coche => {
            if (coche?.reservadoPor) {
              // Si hay UID del usuario, buscamos su nombre
              return this.authService.getUserById(coche.reservadoPor).pipe(
                map(userData => ({ ...coche, reservadorNombre: userData?.['nombre'] }))
              );
            }
            return of(coche);
          })
        );
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

  async deleteCar(id: string) {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este coche?');
    if (!confirmDelete) return;
    try {
      await this.cochesService.deleteCar(id);
      this.router.navigate(['/coches']);
      alert('Coche eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar coche:', error);
      alert('Error al eliminar el coche');
    }
  }

  async removeReserva(idCoche: string) {
    const confirmRemove = confirm('¿Seguro que quieres quitar la reserva de este coche?');
    if (!confirmRemove) return;
    try {
      await this.cochesService.quitarReserva(idCoche);
      alert('Reserva eliminada correctamente');
    } catch (error) {
      console.error('Error al quitar la reserva:', error);
      alert('Error al eliminar la reserva');
    }
  }

  abrirImagen(url: string, alt: string) {
    this.dialog.open(ImagenModalComponent, {
      data: { url, alt },
      panelClass: 'custom-dialog-container'
    });
  }

}