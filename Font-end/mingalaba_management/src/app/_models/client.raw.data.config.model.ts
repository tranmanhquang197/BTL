import {SuperEntity} from '@next-solutions/next-solutions-base';

export class ClientRawDataConfig extends SuperEntity {
  code: string | undefined | null;
  clientId: string | undefined | null;
  promotionGroupCode: string | undefined | null;
  promotionTypeCode: string | undefined | null;
  baseUrl: string | undefined | null;
  nativeUrl: string | undefined | null;
  method: 'POST' | 'GET' | undefined | null;
  httpParam: string | undefined | null;
  httpHeader: string | undefined | null;
  body: string | undefined | null;
}
