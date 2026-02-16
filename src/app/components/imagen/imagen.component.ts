import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-imagen-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="modal-header">
      <button mat-icon-button (click)="close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <div class="modal-body">
      <img [src]="data.url" [alt]="data.alt" class="imagen-grande" />
    </div>
  `,
  styles: [`
    .modal-body { display:flex; justify-content:center; align-items:center; }
    .imagen-grande { max-width:90vw; max-height:80vh; }
    .modal-header { display:flex; justify-content:flex-end; }
  `]
})
export class ImagenModalComponent {
  private dialogRef = inject(MatDialogRef<ImagenModalComponent>);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { url: string, alt: string }) {}

  close() {
    this.dialogRef.close();
  }
}