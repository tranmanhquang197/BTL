import {SuperEntity} from "@next-solutions/next-solutions-base";

export class Distributor extends SuperEntity{
  code: string;
  name: string;


  constructor(code: string, name: string) {
    super();
    this.code = code;
    this.name = name;
  }
}
