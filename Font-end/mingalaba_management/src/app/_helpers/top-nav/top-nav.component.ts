import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavService } from '../../_services/nav.service';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { AppComponent } from '../../app.component';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import {
  ApiService,
  AuthoritiesService,
  LoaderService,
  SingletonTranslateService,
} from '@next-solutions/next-solutions-base';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss'],
})
export class TopNavComponent implements OnInit, OnDestroy {
  selectedLanguage: string;
  currentTheme: string;
  messageBoxShow = true;
  languageKey: string = 'lang' + environment.CLIENT_ID;
  @ViewChild('userName') userName!: ElementRef;
  unsubscribe$ = new Subject();
  constructor(public navService: NavService, private translate: TranslateService,
    public cookieService: CookieService, private appComponent: AppComponent,
    private router: Router, private location: Location,
    protected authoritiesService: AuthoritiesService,
    protected singletonTranslateService: SingletonTranslateService,
    protected apiService: ApiService,
    private _cdr: ChangeDetectorRef,
    protected loaderService: LoaderService,
    public dialog: MatDialog,
  ) {
    this.selectedLanguage = '' + sessionStorage.getItem(this.languageKey);
    if (this.cookieService.get('theme') === 'undefined' || this.cookieService.get('theme') === '') {
      this.currentTheme = environment.DEFAULT_THEME;
    } else {
      this.currentTheme = this.cookieService.get('theme');
    }
    appComponent.changeTheme(this.currentTheme);
    this.cookieService.set('theme', this.currentTheme);
  }

  onChangeLanguage(event: any) {
    this.selectedLanguage = event.value;
    sessionStorage.setItem(this.languageKey, event.value);
    this.singletonTranslateService.currentLanguage.next(event.value);
  }

  onChangeTheme(event: any) {
    this.currentTheme = event.value;
    this.appComponent.changeTheme(this.currentTheme);
    this.cookieService.set('theme', this.currentTheme);
  }

  getLanguages() {
    return environment.LANGS;
  }

  get environment() {
    return environment;
  }


  get username() {
    const userName = window.sessionStorage.getItem('userName');
    return !window.sessionStorage.getItem('userName') ? '': userName ;
  }

  showUserMenu() {
    const username = this.userName.nativeElement;
    if (username.classList.contains('off')) {
      username.classList.remove('off');
    } else {
      username.classList.add('off');
    }
  }
  logOut() {
    this.router.navigate(['logout']);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnInit(): void {
  }
}
