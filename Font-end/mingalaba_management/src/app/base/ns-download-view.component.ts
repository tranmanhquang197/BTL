import {Component, Input} from '@angular/core';
import {FileSaverService} from "ngx-filesaver";
import {ApiService} from "@next-solutions/next-solutions-base";
import {environment} from "../../environments/environment";


@Component({
  selector: 'ns-download-view',
  template: `
    <div class="ns-input-view">
      <div class="field_name">{{(label ? label : placeholder) | translate}}</div>
      <div class="field_content"><a download (click)="downloadFile()">{{fileName}}</a></div>
    </div>
  `,
  styles: [
      `
      .ns-input {
        align-items: baseline;
      }

      .field_content{
        text-decoration: underline;
        color: blue;
      }
    `
  ],
  providers: [],
})

export class NsDownloadViewComponent {

  @Input() label = '';
  @Input() placeholder = '';
  @Input() fileName = '';
  @Input() url = '';

  constructor(private fileSaverService: FileSaverService,
              private apiService: ApiService) {
  }

  downloadFile() {
    this.apiService.saveFile(this.url, null, {}, environment.BILLING_FILE_SERVER + '/files/');
    if (this.fileName && this.fileName.endsWith('.pdf')) {
      // const x = window.open(this.url, this.fileName);
    } else {
      // this.fileSaverService.save(file.binary, file.name);
    }
  }
}


