import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Para *ngIf y AsyncPipe
import { AuthService } from '../services/auth.service'; // Ajusta la ruta a tu carpeta de servicios

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule], // Añadimos CommonModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  // Inyectamos el servicio
  public authService = inject(AuthService);

  // Método para cerrar sesión
  async logout() {
    try {
      await this.authService.logout();
      // El servicio ya se encarga de redirigir al login
    } catch (error) {
      console.error('Error al cerrar sesión desde el componente:', error);
    }
  }
}
