import {SuperEntity} from "./SuperEntity";

export class TreeFields {
    rootData: SuperEntity[] = [];
    value: (node: any) => string | number = (node) => `${node}`;
    display: (node: any) => string = (node) => `${node}`;
    children: (node: any) => any[] = (node) => [];
}
