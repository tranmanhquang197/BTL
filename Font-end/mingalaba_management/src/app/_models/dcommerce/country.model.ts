import {SuperEntity} from '@next-solutions/next-solutions-base';

export class Country extends SuperEntity {
  isocode: string | undefined | null;
  support: boolean | undefined | null;
  countryDescriptions: any[] | undefined | null;
}
