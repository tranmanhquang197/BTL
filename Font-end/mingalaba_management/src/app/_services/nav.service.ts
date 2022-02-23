import {Injectable} from '@angular/core';
import {Event, NavigationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import { NavItem } from '@next-solutions/next-solutions-base';

@Injectable()
export class NavService {
  public appDrawer: any;
  public title: string | undefined | null;
  public currentUrl = new BehaviorSubject<string>('');
  public username: string | undefined | null;
  breadcrumbList: Array<any> = [];
  navItems: NavItem[] | undefined | null;
  constructor(private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  public closeNav() {
    this.appDrawer.close();
  }

  public openNav() {
    this.appDrawer.open();
  }
}
