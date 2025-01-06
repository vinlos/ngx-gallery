import {ChangeDetectionStrategy, Component, OnInit, input, output} from '@angular/core';

@Component({
    selector: 'ngx-gallery-action',
    templateUrl: './ngx-gallery-action.component.html',
    styleUrls: ['./ngx-gallery-action.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxGalleryActionComponent {
  readonly icon = input<string>(undefined);
  readonly disabled = input(false);
  readonly titleText = input('');

  readonly closeClick = output<Event>();

  constructor() {
  }

  handleClick(event: Event) {
    if (!this.disabled()) {
      this.closeClick.emit(event);
    }

    event.stopPropagation();
    event.preventDefault();
  }
}
