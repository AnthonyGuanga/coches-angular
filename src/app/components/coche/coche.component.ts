import { Component, OnInit, inject } from '@angular/core'; // Usamos inject (opcional pero moderno)
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

// Importamos tu servicio y la interfaz
import { CochesService, Coche } from '../../services/coches.service';

@Component({
  selector: 'app-coche',
  standalone: true,
  imports: [RouterModule, CommonModule, ReactiveFormsModule],
  templateUrl: './coche.component.html',
  styleUrls: ['./coche.component.css']
})
export class CocheComponent implements OnInit {

  // Inyección de dependencias
  private cochesService = inject(CochesService);
  private router = inject(Router);

  // Observables
  coches$!: Observable<Coche[]>; // Datos crudos
  filteredCoches$!: Observable<Coche[]>; // Datos filtrados para la vista

  // Formulario reactivo para la barra lateral
  filterForm = new FormGroup({
    busqueda: new FormControl(''),
    precioMax: new FormControl(60000),
    tipo: new FormControl('') // <--- Nuevo filtro para usar tu array de tipos
  });

  ngOnInit(): void {
    // 1. Traemos TODOS los coches (pasamos null para no filtrar en servidor aún)
    // Esto permite que el slider de precio sea rápido sin recargar la BD.
    this.coches$ = this.cochesService.getCoches(null);

    // 2. Combinamos los datos con los cambios del formulario
    this.filteredCoches$ = combineLatest([
      this.coches$,
      this.filterForm.valueChanges.pipe(startWith(this.filterForm.value))
    ]).pipe(
      map(([coches, filters]) => {

        const texto = (filters.busqueda || '').toLowerCase();
        const precio = filters.precioMax || 1000000;
        const tipoSeleccionado = filters.tipo || '';

        return coches.filter(coche => {
          // A. Filtro Texto (Marca o Modelo)
          const matchTexto =
            (coche.marca?.toLowerCase().includes(texto)) ||
            (coche.modelo?.toLowerCase().includes(texto));

          // B. Filtro Precio
          const matchPrecio = (coche.precio || 0) <= precio;

          // C. Filtro Tipo (Array)
          // Verificamos si el array de tipos del coche incluye el seleccionado
          // Si no hay tipo seleccionado en el filtro, devolvemos true (mostrar todos)
          const matchTipo = tipoSeleccionado === ''
            ? true
            : coche.tipo?.some(t => t.toLowerCase() === tipoSeleccionado.toLowerCase());

          return matchTexto && matchPrecio && matchTipo;
        });
      })
    );
  }

  goToDetalle(id: string) {
    this.router.navigate(['/coche-detalle', id]);
  }
}