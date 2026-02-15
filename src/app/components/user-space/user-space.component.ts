import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-space',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-space.component.html',
  styleUrl: './user-space.component.css'
})
export class UserSpaceComponent {
  private reservaService = inject(ReservaService);
  
  public misReservas$: Observable<any[]> = this.reservaService.getMisReservas();

  // 👇 AÑADE ESTA FUNCIÓN
  async cancelarReserva(idCoche: string) {
    if (confirm('¿Estás seguro de que quieres quitar esta reserva?')) {
      try {
        await this.reservaService.cancelarReserva(idCoche);
        // No necesitas hacer nada más, la lista se actualizará sola
      } catch (error) {
        alert('Error al cancelar la reserva');
      }
    }
  }
}