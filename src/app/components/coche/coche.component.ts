import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CochesService, Coche } from '../../services/coches.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-coche',
  standalone: true, // ⬅⬅⬅ IMPORTANTE
  imports: [RouterModule, CommonModule], // ⬅ Necesario para routerLink y *ngIf/*ngFor
  templateUrl: './coche.component.html',
  styleUrls: ['./coche.component.css'],
})
export class cocheComponent implements OnInit {
  coches$!: Observable<Coche[]>;

  constructor(
    private cochesService: CochesService,
    private router: Router // ⬅ para navegación programática
  ) {}

  ngOnInit(): void {
    this.coches$ = this.cochesService.getCoches();
  }

  // 🚀 Navegación programática (opción segura si routerLink falla)
  goToDetalle(id: string) {
    this.router.navigate(['/coche-detalle', id]);
  }
}
