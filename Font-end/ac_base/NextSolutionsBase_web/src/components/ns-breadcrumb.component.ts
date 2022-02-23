import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { BreadcrumbModel } from '../models/breadcrumb.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ns-breadcrumb',
  template: `
    <ul class="breadcrumb">
      <div class="breadcrumbList">
        <li *ngFor="let item of breadcrumbList; let i = index">
          <a [routerLink]="'/' + item.url" *ngIf="i!==breadcrumbList.length-1">
            {{ item.label | translate}}
          </a>
          <span class="separator" *ngIf="i!==breadcrumbList.length-1"> <i class="fa fa-angle-right"></i> </span>
          <span class="currentAction" *ngIf="i===breadcrumbList.length-1">{{ item.label | translate }}</span>
        </li>
      </div>
    </ul>
  `,
  // styleUrls: ['./../styles/ns-style/breadcrumb.scss'],
})
export class NsBreadcrumbComponent implements OnInit{
  breadcrumbList: Array<BreadcrumbModel> =[];
@Output() updateLabel = new EventEmitter();
  constructor(private activatedRoute: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.breadcrumbList = this.buildBreadCrumb(this.activatedRoute.root);
  }

  buildBreadCrumb(route: ActivatedRoute, url: string = '',
                  breadcrumbs: Array<BreadcrumbModel> = []): Array<BreadcrumbModel> {

    let label = route.routeConfig
      ? (route.routeConfig.data ? route.routeConfig.data['breadcrumb'] : 'common.missing.router.data.breadcrumb')
      : '';
    if(this.updateLabel.observers.length > 0){
        const out = {label};
        this.updateLabel.emit(out);
        label = out.label;
    }
    let path = route.routeConfig && route.routeConfig.path ? route.routeConfig.path : '';
    if (route.snapshot && route.snapshot.params) {
      Object.keys(route.snapshot.params).forEach(key => {
        label = label.replace(':' + key, route.snapshot.params[key]);
        path = path.replace(':' + key, route.snapshot.params[key]);
      });
    }
    const nextUrl = `${url}${path}/`;
    if (nextUrl.endsWith('//')) {
      return breadcrumbs;
    }
    const breadcrumb = new BreadcrumbModel(label, nextUrl);
    const newBreadcrumbs = [...breadcrumbs, breadcrumb];
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    return newBreadcrumbs;
  }
}
