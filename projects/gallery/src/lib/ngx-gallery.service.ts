import { ElementRef, Injectable, Renderer2, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgxGalleryService {
  private renderer = inject(Renderer2);

  private swipeHandlers: Map<string, (() => void)[]> = new Map<string, (() => void)[]>();

  manageSwipe(status: boolean, element: ElementRef, id: string, nextHandler: () => void, prevHandler: () => void): void {

    const handlers = this.getSwipeHandlers(id);

    // swipeleft and swiperight are available only if hammerjs is included
    try {
      if (status && !handlers) {
        this.swipeHandlers.set(id, [
          this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
          this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
        ]);
      } else if (!status && handlers) {
        handlers.map((handler) => handler());
        this.removeSwipeHandlers(id);
      }
    } catch (e) {
    }
  }

  validateUrl(url: string): string {
    if (url.replace) {
      return url.replace(new RegExp(' ', 'g'), '%20')
        .replace(new RegExp('\'', 'g'), '%27');
    } else {
      return url;
    }
  }

  getBackgroundUrl(image: string) {
    return 'url(\'' + this.validateUrl(image) + '\')';
  }

  getFileType (fileSource: string): string {
    const fileExtension = fileSource.split('.').pop().toLowerCase();
    if (fileExtension === 'avi' || fileExtension === 'flv'
      || fileExtension === 'wmv' || fileExtension === 'mov'
      || fileExtension === 'mp4') {
      return 'video';
    }
    return 'image';
}

  private getSwipeHandlers(id: string): (() => void)[] | undefined {
    return this.swipeHandlers.get(id);
  }

  private removeSwipeHandlers(id: string): void {
    this.swipeHandlers.delete(id);
  }
}
