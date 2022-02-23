import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {NavService} from './_services/nav.service';
import {Router} from '@angular/router';
import {AuthenticationService} from './_services/authentication.service';
import {LoginComponent} from './login/login.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Location} from '@angular/common';
import {Subscription} from 'rxjs';
import {
  ApiService,
  AuthoritiesService,
  Menu,
  NavItem,
  OAuth2AuthenticationDto,
} from '@next-solutions/next-solutions-base';
import {environment} from '../environments/environment';
import { TopNavComponent } from './_helpers/top-nav/top-nav.component';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/internal/operators';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(TopNavComponent) topNav!: TopNavComponent;
  @ViewChild('appDrawer', {static: true}) appDrawer: ElementRef | undefined;
  @HostBinding('class') componentCssClass: any | undefined;
  subscription: Subscription | undefined;
  // queryRef?: QueryRef<any>;

  constructor(public overlayContainer: OverlayContainer, private navService: NavService, private router: Router,
              private authenticationService: AuthenticationService, private apiService: ApiService,
              private loginComponent: LoginComponent, private location: Location,
              protected apollo: Apollo,
              private toastr: ToastrService,
              protected authoritiesService: AuthoritiesService) {
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    this.navService.appDrawer = this.appDrawer;

    if (this.authenticationService.isAuthenticated()) {
      if (this.location.isCurrentPathEqualTo('/')) {
        this.router.navigate(['home']).then();
      }
    } else {
      this.router.navigate(['home']).then();
    }

  }



  ngAfterViewInit() {
    this.authoritiesService.me$.subscribe((me: OAuth2AuthenticationDto) => {
      if (!me || !me.userAuthentication || !!this.navService.navItems) {
        return;
      }
      this.apiService.getJSON<NavItem[]>('assets/Menus.json').subscribe((data: NavItem[]) => {
        let menus = [];
        if (me.userAuthentication && me.userAuthentication.principal && me.userAuthentication.principal.roles)
          for (const role of me.userAuthentication.principal.roles) {
            if (role.menus)
              for (const menu of role.menus) {
                menus.push(menu);
              }
          }
        menus = menus.filter(menu => menu.appType === 'WEB');
          const menunu = [
            {
              displayName: 'menu.dashboard',
              iconName: 'fa fa-chart-pie-alt',
              route: 'dashboard',
              roleMenu: 'DASHBOARD'
            },
            {
              displayName: 'menu.users',
              iconName: 'fas fa-child',
              route: 'users',
              roleMenu: 'CHAT_ADMIN'
            },
            {
              displayName: 'Product',
              iconName: 'fad fa-ticket-alt',
              route: 'voucher',
              roleMenu: 'VOUCHER'
            },
            {
              displayName: 'Category',
              iconName: 'far fa-th-large',
              route: 'evoucher',
              roleMenu: 'EVOUCHER'
            },
            {
              displayName: 'Order',
              iconName: 'fal fa-hand-holding-box',
              route: 'report-users'
            },
            {
              displayName: 'menu.logout',
              iconName: 'fa fa-power-off',
              route: 'logout'
            }
          ]

        data = this.getRoleMenu(menunu, menunu);
        this.navService.navItems = data;
        // this.onMouseLeave();
        this.navService.openNav();
      });
    });
  }





  getRoleMenu(navItems: any[], menus: any[]) {
    const result = [];
    for (const navItem of navItems) {
      // const flag = menus.filter(menu => !navItem.roleMenu || menu.code === navItem.roleMenu);
      // if (flag && flag.length > 0) {
      //   if (navItem.children && navItem.children.length > 0) {
      //     navItem.children = this.getRoleMenu(navItem.children, menus);
      //   }
      //   result.push(navItem);
      // } else if ((!menus || menus.length === 0) && !navItem.roleMenu) {
      //   result.push(navItem);
      // }
      result.push(navItem);

    }
    return result;
  }

  changeTheme(theme: any) {
    const overlayContainerClasses = this.overlayContainer.getContainerElement().classList;
    const themeClassesToRemove = Array.from(overlayContainerClasses).filter((item: string) => item !== 'cdk-overlay-container');
    if (themeClassesToRemove.length) {
      overlayContainerClasses.remove(...themeClassesToRemove);
    }
    overlayContainerClasses.add(theme);
    this.componentCssClass = theme;
    const body = document.getElementsByTagName('body')[0];
    body.removeAttribute('class');
    body.classList.add(theme);

    if (theme === 'zeus') {
      const div = document.createElement('div') as HTMLDivElement;
      div.id = 'night_stars';
      body.prepend(div);
    } else {
      const div = document.getElementById('night_stars');
      if (div != null) {
        body.removeChild(div);
      }
    }
  }

  ngOnDestroy(): void {
    // unsubscribe to ensure no memory leaks
    this.subscription?.unsubscribe();
  }

  get navItems() {
    return this.navService.navItems;
  }

  onMouseEnter() {
     this.navService.navItems?.forEach(item => {
       item.isOnlyIcon = false;
     });
  }

  onMouseLeave() {
     if (this.navService.navItems) {
       this.navService.navItems.forEach(item => {
          item.isOnlyIcon = true;
       });
     }
  }

  get imgSrc() {
    return environment.LOADING_IMAGE;
  }

  get isEmbedded() {
    return environment.IS_EMBEDDED;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth < 990 ? this.navService.closeNav() : this.navService.openNav();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any) {
    if(event.target.className !== 'username' && !event.target.closest('.username')) {
      this.topNav.userName.nativeElement.classList.add('off');
    }
  }
}
