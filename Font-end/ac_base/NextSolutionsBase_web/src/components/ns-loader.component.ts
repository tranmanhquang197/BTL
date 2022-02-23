import { Component, Input } from '@angular/core';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'ns-loader',
    template: `
        <div class="ns-loader progress-loader" *ngIf="loaderService.isLoading | async">
            <div class="loading-spinner">
                <mat-progress-bar color="warn" mode="indeterminate">
                </mat-progress-bar>
                <mat-progress-spinner color="warn" mode="indeterminate" diameter="200" strokeWidth="15">
                </mat-progress-spinner>
            </div>
            <img *ngIf="imgSrc ? true : false" [src]="imgSrc"/>
        </div>
    `,
    // styleUrls: ['../styles/ns-style/ns-loader.scss'],
})
export class NsLoaderComponent {

    @Input() imgSrc: string = '';

    constructor(public loaderService: LoaderService) {
    }
}
