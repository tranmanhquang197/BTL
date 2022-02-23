import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-ns-input-view-horizontal',
  template: `
        <div class="ns-input-view"
             style="width: 100%;"
             fxLayout="row wrap"
             fxLayout.lt-md="row wrap">
            <mat-label fxFlex="1 1">
                {{(label ? label : '') | translate}}
            </mat-label>
            <mat-label fxFlex="1 1">
             {{text}}
            </mat-label>

        </div>
    `,
  styles: [
    `
            .ns-input {
                align-items: baseline;
            }
        `
  ],
  providers: [

  ],
})

export class NsInputViewHorizontalComponent{

  @Input() label = '';
  @Input() text = '';

}


