import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
    animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
    selector: 'dialog-image',
    templateUrl: 'dialog-image.component.html',
})
export class DialogImageComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}