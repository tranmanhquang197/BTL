import { AlignEnum } from './enum/align.enum';

export class FooterFields {
  columnDef: string = '';
  title: (e: any) => string = (e) => `${e}`;
  cell: (e: any) => string = (e) => `${e}`;
  colspan: number | ((e: any) => number) = 1;
  align?: AlignEnum = AlignEnum.LEFT;
  className?: ((e: any) => string) | string;
  display?: (e:any) => boolean; // default is false
}
