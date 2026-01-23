import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Coche, CochesService } from '../../services/coches.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-form-coche',
  imports: [ReactiveFormsModule, MatIconModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './form-coche.component.html',
  styleUrl: './form-coche.component.css',
})
export class FormCocheComponent implements OnInit {
  form: FormGroup;
  id: string | null = null;
  titulo = 'Nuevo Coche';
  loading = false;

  listaCombustibles = ['Gasolina', 'Diesel', 'Híbrido', 'Eléctrico', 'GLP'];
  listaCambios = ['Manual', 'Automático'];
  listaTipos = ['SUV', 'Sedán', 'Compacto', 'Familiar', 'Deportivo', '4x4', 'Cabrio'];

  constructor(
    private fb: FormBuilder,
    private cochesService: CochesService,
    private router: Router,
    private aRouter: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {
    this.form = this.fb.group({
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      motor: ['', Validators.required],
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(1980)]],
      kilometraje: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(100)]],
      combustible: ['', Validators.required],
      cambio: ['Manual', Validators.required],
      tipo: [[], Validators.required],

      fotoPrincipal: [''],
      fotos: [[]],
    });
  }

  ngOnInit(): void {
    this.id = this.aRouter.snapshot.paramMap.get('id');

    if (this.id) {
      this.titulo = 'Editar Coche';
      this.loading = true;

      this.cochesService.getCocheById(this.id).subscribe({
        next: (data: Coche) => {
          console.log('Coche Firestore:', data);

          this.form.patchValue({
            marca: data.marca ?? '',
            modelo: data.modelo ?? '',
            motor: data.motor ?? '',
            anio: data.anio ?? new Date().getFullYear(),
            kilometraje: data.kilometraje ?? 0,
            precio: data.precio ?? 0,
            combustible: data.combustible ?? '',
            cambio: data.cambio ?? 'Manual',
            tipo: data.tipo ?? [],
            fotoPrincipal: data.fotoPrincipal ?? '',
            fotos: data.fotos ?? [],
          });

          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  saveCoche() {
    if (this.form.invalid) return;

    this.loading = true;
    const coche = this.form.value;

    if (this.id) {
      this.cochesService.updateCoche(this.id, coche).then(() => {
        this.snackbar.open('Coche actualizado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/coches']);
      });
    } else {
      this.cochesService.addCoche(coche).then(() => {
        this.snackbar.open('Coche guardado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/coches']);
      });
    }
  }
}
