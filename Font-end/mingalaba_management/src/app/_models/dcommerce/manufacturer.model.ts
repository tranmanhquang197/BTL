import {ManufacturerDescription} from "./manufacturer.description.model";
import {Country} from './country.model';

export class Manufacturer {
  code: string;
  name: string;
  descriptions: ManufacturerDescription[] | undefined | null;

  constructor(code: string, name: string) {
    this.code = code;
    this.name = name;
  }
}
