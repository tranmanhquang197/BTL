import {Component, Injectable, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../_services/authentication.service';
import {HttpErrorResponse, HttpParams} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Location} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {MatDialog} from '@angular/material/dialog';
import {environment} from '../../environments/environment';
import {ApiService, AuthoritiesService, FormStateService, UtilsService} from '@next-solutions/next-solutions-base';
import {NavService} from '../_services/nav.service';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import {ToastrService} from 'ngx-toastr';
import {take} from 'rxjs/internal/operators';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
@Injectable()
export class LoginComponent implements OnInit {
    form: FormGroup = new FormGroup({
        username: new FormControl(''),
        password: new FormControl(''),
        remember: new FormControl(''),
        confirmPassword: new FormControl('')
    });
    error: string | null | undefined;
    roleName = '';
    register = false;

    constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private router: Router,
                private authenticationService: AuthenticationService, private apiService: ApiService,
                private cookieService: CookieService, private location: Location, private translateService: TranslateService,
                private authoritiesService: AuthoritiesService, protected formStateService: FormStateService,
                public apollo: Apollo,
                protected utilsService: UtilsService,
                private toastr: ToastrService,
                private navService: NavService) {


    }

    submit() {
        this.resetInfo();
        if (this.form.valid) {
            const password = this.form.controls.password.value;
            const usernames = this.form.controls.username.value;
            if(this.register){
                this.authenticationService.register(usernames,password).subscribe((datas:any) => {
                    this.utilsService.onSuccessFunc('Bạn đã đăng ký thành công ');
                }, error => {
                    this.utilsService.showErrorToarst('Tài khoản đã được đăng ký');
                })
            }else{
                this.authenticationService.login(usernames,password).subscribe((datas:any) => {


                    window.sessionStorage.setItem('userName', datas.data.username);
                    window.sessionStorage.setItem('userId', datas.data.id);
                    window.sessionStorage.setItem('role', datas.data.roles.name);
                    this.hideLoginModal();

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

                    const data = this.getRoleMenu(menunu, menunu);
                    this.navService.navItems = data;
                    // this.onMouseLeave();




                    this.navService.openNav();

                }, error => {
                    this.translateService.get('login.error').subscribe(e => {
                        this.utilsService.showErrorToarst("Tài khoản đăng nhập không đúng");

                    });
                });
            }

        }
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

    resetInfo() {
        this.authoritiesService.me = null;
        this.navService.navItems = null;
        this.formStateService.setMapState(new Map<string, FormGroup>());
    }


    ngOnInit() {
        window.sessionStorage.removeItem('token');
        window.sessionStorage.removeItem('distributorCode');
    }


    showLoginModal() {
        return this.dialog.open(LoginComponent, {disableClose: true});
    }

    hideLoginModal() {
        this.dialog.closeAll();
    }

    registers(event:any){
        this.register = event;
    }
}
