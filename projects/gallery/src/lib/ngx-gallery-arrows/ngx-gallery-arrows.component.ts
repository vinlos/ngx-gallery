import {ChangeDetectionStrategy, Component, OnInit, input, output} from '@angular/core';

@Component({
    selector: 'ngx-gallery-arrows',
    templateUrl: './ngx-gallery-arrows.component.html',
    styleUrls: ['./ngx-gallery-arrows.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxGalleryArrowsComponent {
  readonly prevDisabled = input<boolean>(undefined);
  readonly nextDisabled = input<boolean>(undefined);
  readonly arrowPrevIcon = input<string>(undefined);
  readonly arrowNextIcon = input<string>(undefined);

  readonly prevClick = output();
  readonly nextClick = output();

  constructor() { }

  handlePrevClick(): void {
    this.prevClick.emit();
  }

  handleNextClick(): void {
    this.nextClick.emit();
  }
}
