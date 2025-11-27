import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CochesService, Coche } from '../../services/coches.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category',
  standalone: true,                       // ⬅⬅⬅ IMPORTANTE
  imports: [RouterModule, CommonModule],  // ⬅ Necesario para routerLink y *ngIf/*ngFor
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})
export class CategoryComponent implements OnInit {

  coches$!: Observable<Coche[]>;

  constructor(
    private cochesService: CochesService,
    private router: Router        // ⬅ para navegación programática
  ) { }

  ngOnInit(): void {
    this.coches$ = this.cochesService.getCoches();
  }

  // 🚀 Navegación programática (opción segura si routerLink falla)
  goToDetalle(id: string) {
    this.router.navigate(['/category-detalle', id]);
  }
}
