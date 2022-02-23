import {SuperEntity} from '@next-solutions/next-solutions-base';

export class Class extends SuperEntity {
  clientId: string | undefined | null;
  code: string | undefined | null;
  description: string | undefined | null;
  status: number | undefined | null;

  constructor(form: number) {
    super();
    this.id = form;
  }
}
