import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Coche, CochesService } from '../../services/coches.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-coche',
  imports: [],
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
}
