import {ChangeDetectionStrategy, Component, OnInit, input, output} from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ngx-gallery-bullets',
    templateUrl: './ngx-gallery-bullets.component.html',
    styleUrls: ['./ngx-gallery-bullets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass]
})
export class NgxGalleryBulletsComponent {
  readonly count = input<number>(undefined);
  readonly active = input(0);

  readonly bulletChange = output<number>();

  constructor() { }

  getBullets(): number[] {
    return Array(this.count());
  }

  handleChange(event: Event, index: number): void {
    this.bulletChange.emit(index);
  }
}
