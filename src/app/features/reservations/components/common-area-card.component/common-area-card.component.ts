import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonArea} from '../../model/common-area.model';

@Component({
  selector: 'app-common-area-card',
  imports: [],
  templateUrl: './common-area-card.component.html',
  styleUrl: './common-area-card.component.css',
})
export class CommonAreaCardComponent {
  @Input() commonArea!: CommonArea;
  @Output() editRules = new EventEmitter<CommonArea>();
  @Output() statusChanged = new EventEmitter<CommonArea>();
  @Output() viewHistory = new EventEmitter<CommonArea>();

  constructor() { }
  get areaIcon(): string {
    switch (this.commonArea?.type) {
      case 'POOL':
        return 'pool';
      case 'GYM':
        return 'fitness_center';
      case 'COWORKING_ROOM':
        return 'groups';
      case 'BBQ_AREA':
        return 'outdoor_grill';
      case 'PARTY_ROOM':
        return 'celebration';
      case 'MEETING_ROOM':
        return 'meeting_room';
      default:
        return 'apartment';
    }
  }

  /**
   * Texto corto que resume la regla mas relevante del area.
   * Se evalua en orden de prioridad y solo se muestra el primero
   * que aplique.
   */
  get areaBadge(): string {
    const area = this.commonArea;

    if (area.bookingType === 'EXCLUSIVE') {
      return 'PREMIUM AMENITY';
    }

    if (!area.rules?.requiresApproval) {
      return 'OPEN ACCESS';
    }

    if ((area.rules?.price ?? 0) > 0) {
      return 'FEE APPLIES';
    }

    return `CAPACITY: ${area.maxCapacity}`;
  }

  get areaStatus(): string {
    return this.commonArea?.status === 'AVAILABLE'
      ? 'Disponible'
      : 'Mantenimiento';
  }
  openEditRules(area: CommonArea) {
    this.editRules.emit(area);
  }
  openHistory() {
    this.viewHistory.emit(this.commonArea);
  }
  toggleStatus() {
    const updatedArea: CommonArea = {
      ...this.commonArea,
      status: this.commonArea.status === 'AVAILABLE'
        ? 'MAINTENANCE'
        : 'AVAILABLE'
    };
    this.statusChanged.emit(updatedArea);
  }


  }
