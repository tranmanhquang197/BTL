import {SuperEntity} from '@next-solutions/next-solutions-base';
import {Country} from './country.model';

export class CountryLocation extends SuperEntity {
  country: Country | undefined | null;
  locationType: string | undefined | null;
  code: string | undefined | null;
  name: string | undefined | null;
  parent: CountryLocation | undefined;
  status: number | undefined | null;
  children: CountryLocation[] | undefined | null;
}
