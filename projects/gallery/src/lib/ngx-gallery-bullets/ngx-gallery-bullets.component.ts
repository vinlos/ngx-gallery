import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ngx-gallery-bullets',
    templateUrl: './ngx-gallery-bullets.component.html',
    styleUrls: ['./ngx-gallery-bullets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass]
})
export class NgxGalleryBulletsComponent {
  @Input() count: number;
  @Input() active = 0;

  @Output() bulletChange = new EventEmitter();

  constructor() { }

  getBullets(): number[] {
    return Array(this.count);
  }

  handleChange(event: Event, index: number): void {
    this.bulletChange.emit(index);
  }
}
