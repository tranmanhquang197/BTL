import {Component, Input} from '@angular/core';
import {environment} from '../../environments/environment';

@Component({
  selector: 'ns-image-view',
  template: `
    <div class="ns-image-view">
      <img [src]="src"
           #img
           (load)="onLoad(img)"
           (error)="onErrorLoadImage(img)">
    </div>
  `,
  styles: [`
    .ns-image-view {
      height: 185px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      border-radius: 10px;
    }

    .ns-image-view img {
      display: none;
    }
  `]
})
export class NsImageViewComponent {
  $src = '';

  @Input() set src(val) {
    console.log(val,'king')
    this.$src = val;
  }

  get src() {
    return this.$src;
  }

  constructor() {
  }

  onLoad(img: HTMLImageElement) {
    const parentElement = img.closest('.ns-image-view') as HTMLElement;
    parentElement.setAttribute('style', 'background-image:url("' + img.src + '")');
  }

  onErrorLoadImage(img: HTMLImageElement) {
    img.onerror = null;
    img.src = environment.NO_IMAGE_AVAILABLE;
    const parentElement = img.closest('.ns-image-view') as HTMLElement;
    parentElement.setAttribute('style', 'background-image:url("' + img.src + '")');
  }
}
