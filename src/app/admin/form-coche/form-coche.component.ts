import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Coche, CochesService } from '../../services/coches.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-form-coche',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule,
    MatDividerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
  ],
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
      fotos: [''],
    });
  }
  ngOnInit(): void {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    if (this.id !== null) {
      this.titulo = 'Editar Coche';
      this.loading = true;
      this.cochesService.getCocheById(this.id).subscribe((data: Coche) => {
        this.loading = false;
        this.form.setValue(data);
      });
    }
  }

  saveCoche() {
    if (this.form.valid) {
      const nuevoCoche = this.form.value;

      this.cochesService
        .addCoche(nuevoCoche)
        .then(() => {
          console.log('Coche guardado');
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
  irAlListado() {
    this.snackbar.open('Guardado correctamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/coches']);
  }
}
