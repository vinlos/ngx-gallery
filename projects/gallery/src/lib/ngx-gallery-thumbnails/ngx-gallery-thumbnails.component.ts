import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, OnChanges, SimpleChanges, inject, input, output } from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeStyle} from '@angular/platform-browser';
import {NgxGalleryService} from '../ngx-gallery.service';
import {NgxGalleryAction} from '../ngx-gallery-action';
import {NgxGalleryOrder} from '../ngx-gallery-order';
import { NgClass } from '@angular/common';
import { NgxGalleryActionComponent } from '../ngx-gallery-action/ngx-gallery-action.component';
import { NgxGalleryArrowsComponent } from '../ngx-gallery-arrows/ngx-gallery-arrows.component';

@Component({
    selector: 'ngx-gallery-thumbnails',
    templateUrl: './ngx-gallery-thumbnails.component.html',
    styleUrls: ['./ngx-gallery-thumbnails.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, NgxGalleryActionComponent, NgxGalleryArrowsComponent]
})
export class NgxGalleryThumbnailsComponent implements OnChanges {
  private sanitization = inject(DomSanitizer);
  private elementRef = inject(ElementRef);
  private helperService = inject(NgxGalleryService);

  thumbnailsLeft: string;
  thumbnailsMarginLeft: string;
  mouseenter: boolean;
  remainingCountValue: number;

  minStopIndex = 0;

  readonly images = input<string[] | SafeResourceUrl[]>(undefined);
  readonly isAnimating = input<boolean>(undefined);
  readonly links = input<string[]>(undefined);
  readonly labels = input<string[]>(undefined);
  readonly linkTarget = input<string>(undefined);
  readonly columns = input<number>(undefined);
  readonly rows = input<number>(undefined);
  readonly arrows = input<boolean>(undefined);
  readonly arrowsAutoHide = input<boolean>(undefined);
  readonly margin = input<number>(undefined);
  @Input() selectedIndex: number;
  readonly clickable = input<boolean>(undefined);
  readonly swipe = input<boolean>(undefined);
  readonly size = input<string>(undefined);
  readonly arrowPrevIcon = input<string>(undefined);
  readonly arrowNextIcon = input<string>(undefined);
  readonly moveSize = input<number>(undefined);
  readonly order = input<number>(undefined);
  readonly remainingCount = input<boolean>(undefined);
  readonly lazyLoading = input<boolean>(undefined);
  readonly actions = input<NgxGalleryAction[]>(undefined);

  readonly activeChange = output<number>();

  private index = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedIndex']) {
      this.validateIndex();
    }

    if (changes['swipe']) {
      this.helperService.manageSwipe(this.swipe(), this.elementRef,
        'thumbnails', () => this.moveRight(), () => this.moveLeft());
    }

    const images = this.images();
    if (images) {
      this.remainingCountValue = images.length - (this.rows() * this.columns());
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.mouseenter = true;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.mouseenter = false;
  }

  reset(index: number): void {
    this.selectedIndex = index;
    this.setDefaultPosition();

    this.index = 0;
    this.validateIndex();
  }

  getImages(): string[] | SafeResourceUrl[] {
    const images = this.images();
    if (!images) {
      return [];
    }

    const order = this.order();
    if (this.remainingCount()) {
      return images.slice(0, this.rows() * this.columns());
    } else if (this.lazyLoading() && order !== NgxGalleryOrder.Row) {
      let stopIndex = 0;

      if (order === NgxGalleryOrder.Column) {
        stopIndex = (this.index + this.columns() + this.moveSize()) * this.rows();
      } else if (order === NgxGalleryOrder.Page) {
        stopIndex = this.index + ((this.columns() * this.rows()) * 2);
      }

      if (stopIndex <= this.minStopIndex) {
        stopIndex = this.minStopIndex;
      } else {
        this.minStopIndex = stopIndex;
      }

      return images.slice(0, stopIndex);
    } else {
      return images;
    }
  }

  handleClick(event: Event, index: number): void {
    if (!this.hasLink(index) && !this.isAnimating()) {
      this.selectedIndex = index;
      this.activeChange.emit(index);
    }
    event.stopPropagation();
    event.preventDefault();
  }

  hasLink(index: number): boolean {
    const links = this.links();
    return !!(links && links.length && links[index]);
  }

  moveRight(): void {
    if (this.canMoveRight()) {
      this.index += this.moveSize();
      const maxIndex = this.getMaxIndex() - this.columns();

      if (this.index > maxIndex) {
        this.index = maxIndex;
      }

      this.setThumbnailsPosition();
    }
  }

  moveLeft(): void {
    if (this.canMoveLeft()) {
      this.index -= this.moveSize();

      if (this.index < 0) {
        this.index = 0;
      }

      this.setThumbnailsPosition();
    }
  }

  canMoveRight(): boolean {
    return this.index + this.columns() < this.getMaxIndex();
  }

  canMoveLeft(): boolean {
    return this.index !== 0;
  }

  getThumbnailLeft(index: number): SafeStyle {
    let calculatedIndex;

    const order = this.order();
    if (order === NgxGalleryOrder.Column) {
      calculatedIndex = Math.floor(index / this.rows());
    } else if (order === NgxGalleryOrder.Page) {
      calculatedIndex = (index % this.columns()) + (Math.floor(index / (this.rows() * this.columns())) * this.columns());
    } else if (order === NgxGalleryOrder.Row && this.remainingCount()) {
      calculatedIndex = index % this.columns();
    } else {
      calculatedIndex = index % Math.ceil(this.images().length / this.rows());
    }

    return this.getThumbnailPosition(calculatedIndex, this.columns());
  }

  getThumbnailTop(index: number): SafeStyle {
    let calculatedIndex;

    const order = this.order();
    if (order === NgxGalleryOrder.Column) {
      calculatedIndex = index % this.rows();
    } else if (order === NgxGalleryOrder.Page) {
      calculatedIndex = Math.floor(index / this.columns()) - (Math.floor(index / (this.rows() * this.columns())) * this.rows());
    } else if (order === NgxGalleryOrder.Row && this.remainingCount()) {
      calculatedIndex = Math.floor(index / this.columns());
    } else {
      calculatedIndex = Math.floor(index / Math.ceil(this.images().length / this.rows()));
    }

    return this.getThumbnailPosition(calculatedIndex, this.rows());
  }

  getThumbnailWidth(): SafeStyle {
    return this.getThumbnailDimension(this.columns());
  }

  getThumbnailHeight(): SafeStyle {
    return this.getThumbnailDimension(this.rows());
  }

  setThumbnailsPosition(): void {
    this.thumbnailsLeft = -((100 / this.columns()) * this.index) + '%';

    this.thumbnailsMarginLeft = -((this.margin() - (((this.columns() - 1)
      * this.margin()) / this.columns())) * this.index) + 'px';
  }

  setDefaultPosition(): void {
    this.thumbnailsLeft = '0px';
    this.thumbnailsMarginLeft = '0px';
  }

  canShowArrows(): boolean {
    if (this.remainingCount()) {
      return false;
    } else {
      const images = this.images();
      return this.arrows() && images && images.length > this.getVisibleCount()
        && (!this.arrowsAutoHide() || this.mouseenter);
    }
  }

  validateIndex(): void {
    const images = this.images();
    if (images) {
      let newIndex;

      if (this.order() === NgxGalleryOrder.Column) {
        newIndex = Math.floor(this.selectedIndex / this.rows());
      } else {
        newIndex = this.selectedIndex % Math.ceil(images.length / this.rows());
      }

      if (this.remainingCount()) {
        newIndex = 0;
      }

      if (newIndex < this.index || newIndex >= this.index + this.columns()) {
        const maxIndex = this.getMaxIndex() - this.columns();
        this.index = newIndex > maxIndex ? maxIndex : newIndex;

        this.setThumbnailsPosition();
      }
    }
  }

  getSafeUrl(image: string | SafeResourceUrl): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image.toString()));
  }

  getFileType(fileSource: string | SafeResourceUrl): string {
    return this.helperService.getFileType(fileSource.toString());
  }

  private getThumbnailPosition(index: number, count: number): SafeStyle {
    return this.getSafeStyle('calc(' + ((100 / count) * index) + '% + '
      + ((this.margin() - (((count - 1) * this.margin()) / count)) * index) + 'px)');
  }

  private getThumbnailDimension(count: number): SafeStyle {
    const margin = this.margin();
    if (margin !== 0) {
      return this.getSafeStyle('calc(' + (100 / count) + '% - '
        + (((count - 1) * margin) / count) + 'px)');
    } else {
      return this.getSafeStyle('calc(' + (100 / count) + '% + 1px)');
    }
  }

  private getMaxIndex(): number {
    if (this.order() === NgxGalleryOrder.Page) {
      let maxIndex = (Math.floor(this.images().length / this.getVisibleCount()) * this.columns());

      if (this.images().length % this.getVisibleCount() > this.columns()) {
        maxIndex += this.columns();
      } else {
        maxIndex += this.images().length % this.getVisibleCount();
      }

      return maxIndex;
    } else {
      return Math.ceil(this.images().length / this.rows());
    }
  }

  private getVisibleCount(): number {
    return this.columns() * this.rows();
  }

  private getSafeStyle(value: string): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle(value);
  }
}
