import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-car-type-card',
  imports: [],
  standalone: true,
  templateUrl: './car-type-card.component.html',
  styleUrl: './car-type-card.component.css',
})
export class CarTypeCardComponent {
  @Input({ required: true }) tipo!: {
    id: string;
    label: string;
    icon: string;
  };

  @Input() active = false;

  @Output() selected = new EventEmitter<string>();

  select() {
    this.selected.emit(this.tipo.id);
  }
}
