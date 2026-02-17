import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop'; // Puente entre RxJS y Signals
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { startWith } from 'rxjs/operators';

// Importamos tu servicio y la interfaz
import { CochesService } from '../../services/coches.service';

@Component({
  selector: 'app-coche',
  standalone: true,
  // CommonModule ya no es estrictamente necesario si usas @for/@if en HTML,
  // pero lo dejo por compatibilidad con pipes antiguos.
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './coche.component.html',
  styleUrls: ['./coche.component.css'],
})
export class CocheComponent {
  // Inyección de dependencias
  private cochesService = inject(CochesService);
  private router = inject(Router);

  // --- 1. Formulario Reactivo ---
  // Mantenemos ReactiveFormsModule porque es robusto,
  // pero convertiremos sus valores a Signals.
  filterForm = new FormGroup({
    busqueda: new FormControl('', { nonNullable: true }),
    precioMax: new FormControl(60000, { nonNullable: true }),
    tipo: new FormControl('', { nonNullable: true }),
  });

  // --- 2. Estado (Signals) ---

  // A: Convertimos los cambios del formulario en un Signal reactivo
  private filters = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue())),
    { initialValue: this.filterForm.getRawValue() }
  );

  // B: Traemos los datos. 'toSignal' se suscribe y cancela automáticamente.
  // Nota: Si usaras la nueva Resource API (Angular 19+), esto sería 'resource' en vez de 'toSignal'.
  private allCoches = toSignal(this.cochesService.getCoches(null), { initialValue: [] });

  // --- 3. Lógica Computada (El cerebro) ---
  // 'computed' se recalcula automáticamente SOLO cuando 'filters' o 'allCoches' cambian.
  filteredCoches = computed(() => {
    const coches = this.allCoches();
    const filters = this.filters();

    const texto = (filters.busqueda || '').toLowerCase();
    const precio = filters.precioMax || 1000000;
    const tipoSeleccionado = filters.tipo || '';

    return coches.filter((coche) => {
      // A. Filtro Texto
      const matchTexto =
        coche.marca?.toLowerCase().includes(texto) || coche.modelo?.toLowerCase().includes(texto);

      // B. Filtro Precio
      const matchPrecio = (coche.precio || 0) <= precio;

      // C. Filtro Tipo
      const matchTipo =
        tipoSeleccionado === ''
          ? true
          : coche.tipo?.some((t) => t.toLowerCase() === tipoSeleccionado.toLowerCase());

      return matchTexto && matchPrecio && matchTipo;
    });
  });

  // Método de navegación simple
  goToDetalle(id: string) {
    this.router.navigate(['/coche-detalle', id]);
  }
}
