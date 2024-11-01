import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'ngx-gallery-arrows',
    templateUrl: './ngx-gallery-arrows.component.html',
    styleUrls: ['./ngx-gallery-arrows.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class NgxGalleryArrowsComponent {
  @Input() prevDisabled: boolean;
  @Input() nextDisabled: boolean;
  @Input() arrowPrevIcon: string;
  @Input() arrowNextIcon: string;

  @Output() prevClick = new EventEmitter();
  @Output() nextClick = new EventEmitter();

  constructor() { }

  handlePrevClick(): void {
    this.prevClick.emit();
  }

  handleNextClick(): void {
    this.nextClick.emit();
  }
}
