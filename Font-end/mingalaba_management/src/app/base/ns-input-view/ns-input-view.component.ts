import {Component, Input, ViewEncapsulation} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";


@Component({
  selector: 'ns-input-view',
  template: `

    <div fxLayout="row" fxLayoutAlign="center" class ="padding-20">
      <div fxFlex="40" class="field_name_custom">{{(label ? label : '') | translate}}</div>
      <div fxFlex="60" class="field_content_custom" *ngIf="!innerHTML">{{text}}</div>
      <div class="_content" *ngIf="innerHTML" [innerHTML]="sanitizer.bypassSecurityTrustHtml(text)"></div>
      <div class="_content" *ngIf="innerText" [innerText]="sanitizer.bypassSecurityTrustHtml(text)"></div>
    </div>
  `,
  styles: [
      `
      .ns-input-view ._content {
        height: 100px;
        overflow: auto;
        white-space: pre-line;
      }
      .field_content_custom {
        margin: 0 5px 14px 5px;
        color: #989898;

      }
      .field_name_custom{
        margin: 0 5px 14px 5px;
        color: Black;
        width: 143px;
      }
    `
  ],
})

export class NsInputViewComponent {
  constructor(public sanitizer: DomSanitizer) {
  }

  @Input() label = '';
  @Input() innerHTML = false;
  @Input() innerText = false;
  $text = '';

  @Input() set text(val) {
    this.$text = val;
  }

  get text() {
    return this.$text;
  }

}


