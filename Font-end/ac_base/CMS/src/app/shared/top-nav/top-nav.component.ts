import {Component, ViewChild, ElementRef, OnInit} from '@angular/core';
import {NavService} from '../../_services/nav.service';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import { AuthoritiesService, SingletonTranslateService } from '@next-solutions/next-solutions-base';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.scss']
})
export class TopNavComponent implements OnInit {
  selectedLanguage: string;
  currentTheme: string;
  languageKey: string = 'lang' + environment.CLIENT_ID;
  @ViewChild('userName') userName!: ElementRef;

  constructor(
    public navService: NavService,
    private translate: TranslateService,
    private cookieService: CookieService,
    private appComponent: AppComponent,
    private router: Router,
    protected authoritiesService: AuthoritiesService,
    protected singletonTranslateService: SingletonTranslateService
  )
  {
    if (this.cookieService.get('lang') === 'undefined' || this.cookieService.get('lang') === '') {
      translate.setDefaultLang(environment.DEFAULT_LANGUAGE);
      this.selectedLanguage = environment.DEFAULT_LANGUAGE;
      this.cookieService.set('lang', environment.DEFAULT_LANGUAGE);
    } else {
      translate.setDefaultLang(this.cookieService.get('lang'));
      this.selectedLanguage = this.cookieService.get('lang');
    }

    if (this.cookieService.get('theme') === 'undefined' || this.cookieService.get('theme') === '') {
      this.currentTheme = environment.DEFAULT_THEME;
    } else {
      this.currentTheme = this.cookieService.get('theme');
    }

    appComponent.changeTheme(this.currentTheme);
    this.cookieService.set('theme', this.currentTheme);
  }

  ngOnInit() {
  }

  onChangeLanguage(event: any) {
    this.translate.use(event.value);
    this.selectedLanguage = event.value;
    this.cookieService.set('lang', event.value);
  }

  onChangeTheme(event: any) {
    this.currentTheme = event.value;
    this.appComponent.changeTheme(this.currentTheme);
    this.cookieService.set('theme', this.currentTheme);
  }
  goToHome() {
    this.router.navigate(['home']);
  }

  getLanguages() {
    return environment.LANGS;
  }

  get username() {
    return !!this.authoritiesService.me ? this.authoritiesService.me.name : '';
  }

  showUserMenu() {
    const username = this.userName.nativeElement;
    if (username.classList.contains('off')) {
      username.classList.remove('off');
    }
    else {
      username.classList.add('off');
    }
  }
}
