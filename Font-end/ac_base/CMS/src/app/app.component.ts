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
import {NavItem} from './_models/nav.item';
import {Router} from '@angular/router';
import {ApiService} from './_services/api.service';
import {AuthenticationService} from './_services/authentication.service';
import {LoginComponent} from './shared/login/login.component';
import {OverlayContainer} from '@angular/cdk/overlay';
import {Location} from '@angular/common';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('appDrawer', {static: false}) appDrawer?: ElementRef;
  @HostBinding('class') componentCssClass: any;
  navItems?: NavItem[];

  get imgSrc(){
    return environment.LOADING_IMAGE;
  }

  constructor(public overlayContainer: OverlayContainer, private navService: NavService, private router: Router,
              private authenticationService: AuthenticationService, private apiService: ApiService,
              private loginComponent: LoginComponent, private location: Location) {
  }

  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
    this.apiService.getJSON('assets/Menus.json').subscribe((data: any) => {
      this.navItems = data;
    });
    console.log('1. ', this.authenticationService.isAuthenticated());
    if (this.authenticationService.isAuthenticated()) {
      if (this.location.isCurrentPathEqualTo('')) {
        this.router.navigate(['home']);
      }
    } else {
      this.loginComponent.showLoginModal();
    }
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

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    event.target.innerWidth < 990 ? this.navService.closeNav() : this.navService.openNav();
  }

  @HostListener('document:click', ['$event'])
  documentClick(event: any) {
    if(event.target.className !== 'username' && !event.target.closest('.username')) {
      // this.topNav.userName.nativeElement.classList.add('off');
    }
  }
}
