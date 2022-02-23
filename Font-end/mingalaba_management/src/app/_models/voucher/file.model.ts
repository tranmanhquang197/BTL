import {DateRangePickerModel, SuperEntity} from '@next-solutions/next-solutions-base';
import { FormGroup } from '@angular/forms';


export class File extends SuperEntity {
  id?: number | undefined;
  file_name?: string | undefined;
  status: number | undefined;
  file_type: string | undefined;
  title: string | undefined;
  description: string| undefined;
  user_id: number | undefined;
  file_url: string | undefined;
  width: number | undefined;
  height: number| undefined;
  type: number|undefined;
  total: number| undefined;
  owner_id : number | undefined;
  createdAt: string | undefined;

  constructor(id:number,file_name: string, file_url: string) {

    super()
    this.id = id;
    this.file_name = file_name;
    this.file_url = file_url;
  }

}
