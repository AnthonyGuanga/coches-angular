import { Component, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { startWith } from 'rxjs/operators';
// 1. Importamos CurrencyPipe específicamente
import { CurrencyPipe } from '@angular/common';

import { CochesService } from '../../services/coches.service';

@Component({
  selector: 'app-coche',
  standalone: true,
  // 2. Lo añadimos al array de imports
  imports: [RouterModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: './coche.component.html',
  styleUrls: ['./coche.component.css'],
})
export class CocheComponent {
  private cochesService = inject(CochesService);
  private router = inject(Router);

  filterForm = new FormGroup({
    busqueda: new FormControl('', { nonNullable: true }),
    precioMax: new FormControl(60000, { nonNullable: true }),
    tipo: new FormControl('', { nonNullable: true }),
  });

  private filters = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue())),
    { initialValue: this.filterForm.getRawValue() }
  );

  private allCoches = toSignal(this.cochesService.getCoches(null), { initialValue: [] });

  filteredCoches = computed(() => {
    const coches = this.allCoches();
    const filters = this.filters();

    const texto = (filters.busqueda || '').toLowerCase();
    const precio = filters.precioMax || 1000000;
    const tipoSeleccionado = filters.tipo || '';

    return coches.filter((coche) => {
      const matchTexto =
        coche.marca?.toLowerCase().includes(texto) || coche.modelo?.toLowerCase().includes(texto);

      const matchPrecio = (coche.precio || 0) <= precio;

      const matchTipo =
        tipoSeleccionado === ''
          ? true
          : coche.tipo?.some((t) => t.toLowerCase() === tipoSeleccionado.toLowerCase());

      return matchTexto && matchPrecio && matchTipo;
    });
  });

  goToDetalle(id: string) {
    this.router.navigate(['/coche-detalle', id]);
  }
}
