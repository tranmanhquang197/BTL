import {AfterViewInit, Component, DoCheck, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Embed, IEmbedConfiguration, models, service as PBIService} from 'powerbi-client';
import {AuthenticationService} from '../_services/authentication.service';
import {HttpClient} from '@angular/common/http';
import {
    ApiService,
    AuthoritiesService,
    BaseTableLayout,
    Menu,
    NavItem,
    UtilsService,
} from '@next-solutions/next-solutions-base';
import {ActivatedRoute, Router} from '@angular/router';
import {NavService} from '../_services/nav.service';
import {Apollo, gql, QueryRef} from 'apollo-angular';
import {take} from 'rxjs/internal/operators';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';
import {createApollo} from '../graphql.module';
import {AuthService} from '../_services/auth.service';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import {SubscriptionService} from '../_services/subscription.service';

const fakeQuery = gql`query{fake}`



@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent extends BaseTableLayout implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    component: Embed | null | undefined;
    accessToken = '';
    tokenType = models.TokenType.Embed;
    embedUrl = '';
    type = 'report'; // type powerbi
    reportId = '';
    loadPowerBIFail = false;
    queryRef?: QueryRef<any>;
    error: string | null | undefined;
    userID: any;
    check = 0;
    idNotification: any;
    querySubscription?: Subscription;
    wsc!: SubscriptionClient;
    roleName = '';
    constructor(@Inject('PowerBIService') public powerBIService: PBIService.Service,
                protected activatedRoute: ActivatedRoute,
                protected authoritiesService: AuthoritiesService,
                private navService: NavService,
                private apiService: ApiService,
                private http: HttpClient,
                private authService: AuthService,
                private toastr: ToastrService,
                public apollo: Apollo,
                private router: Router,
                private utilsService: UtilsService,
                private subService: SubscriptionService,
                private authenticationService: AuthenticationService) {
        super(activatedRoute, authoritiesService);

        this.queryRef = this.apollo.watchQuery({
            query: fakeQuery
        })
        this.wsc = this.subService.getWSClient();
    }

    ngAfterViewInit() {
    }

    ngOnInit() {
        // this.authoritiesService.me$.subscribe((data:any)=>{
        //     console.log('data : ',data);
        //     data.principal.roles.forEach((role:any)=>{
        //         if(role.roleName === 'VOUCHER'){
        //             this.roleName = role.roleName;
        //         }
        //         else if(role.roleName === 'EVOUCHER'){
        //             this.roleName = role.roleName;
        //         }
        //         else if(role.roleName === 'CHAT_ADMIN'){
        //             this.roleName = role.roleName;
        //         }
        //     })
        // });

        // if(this.roleName === 'VOUCHER'){
        //     this.router.navigate(['/voucher']).then();
        // }
        // else if(this.roleName === 'EVOUCHER'){
        //     this.router.navigate(['/evoucher']).then();
        // }
        // else if(this.roleName === 'CHAT_ADMIN'){
        //     this.router.navigate(['/users']).then();
        // }

        this.apollo.watchQuery<any>({
            query: gql`
                        query {
                          getUserMe {
                            display_name
                            id
                          }
                        }
                    `,
        }).valueChanges.subscribe(({data}) => {
            const tokenNewFeet = window.sessionStorage.getItem('tokenNewFeet');
            // @ts-ignore
            this.wsc.close(false, false);
            this.authService.setToken(tokenNewFeet);
            (this.wsc as any).connect();
            this.subcride(data.getUserMe.id.toString());
            window.sessionStorage.setItem('userName', data.getUserMe.display_name);
            window.sessionStorage.setItem('userId', data.getUserMe.id);
        });

    }


    subcride(id: any) {
        const redeemVoucherSuccess = gql`subscription {
                 redeemVoucherSuccess(user_id:${id}) {
                  voucher {
                    id
                    title
                    type {
                      name
                    }
                    description
                    quantity
                  }
                  user {
                    display_name
                  },
                  voucher_information {
                    status
                    id
                    used_date
                    received_date
                    qr_code
                    is_used
                  }
                }
                }`;
        const value = this.queryRef?.queryId;
        // console.log('Value: ',value);
        this.queryRef?.subscribeToMore({
            document: redeemVoucherSuccess,
            updateQuery: (prev, {subscriptionData}) => {

                if (!subscriptionData.data) {
                    return prev;
                }
                console.log('Value: ', subscriptionData);
                const id = subscriptionData.data.redeemVoucherSuccess.voucher.id;
                const content = subscriptionData.data.redeemVoucherSuccess.voucher.title;
                this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
                this.toastr.success(content, 'Redeem Voucher !')
                    .onTap
                    .pipe(take(1))
                    .subscribe(() => this.toasterClickedHandler(id));
                return {}

            }
        })

    }


    toasterClickedHandler(id: any) {
        this.router.navigate(['/evoucher/evoucher-user-info/' + id]).then();
    }

    async loadPowerBI() {
        if (this.authenticationService.isAuthenticated()) {
            const response = await this.apiService.post('/power-bi/embed', null).toPromise()
                .catch(error => {
                    this.loadPowerBIFail = true;
                    this.utilsService.showErrorToarst('validation.powerbi.embed.fail');
                }) as any;
            if (response) {
                this.loadPowerBIFail = false;
                this.accessToken = response.accessToken;
                this.embedUrl = response.embedUrl;
                this.reportId = response.reportId;

                const {accessToken, tokenType, embedUrl, type, reportId} = this;
                const config: IEmbedConfiguration = {accessToken, tokenType, embedUrl, type, id: reportId};
                if (this.validateOptions(accessToken, embedUrl)) {
                    this.embed(document.getElementById('powerbiFrame'), config);
                }
            }
        }
    }


    ngOnChanges(changes: SimpleChanges): void {

        const {accessToken, tokenType, embedUrl, type, id} = changes;

        if (accessToken.previousValue === accessToken.currentValue
            || embedUrl.previousValue === embedUrl.currentValue) {
            return;
        }

        if (this.validateOptions(accessToken.currentValue, embedUrl.currentValue)) {

            /* check if change value was provided in changes
             to prevent error accessing to a property of undefined */
            const config: IEmbedConfiguration = {
                accessToken: accessToken && accessToken.currentValue,
                tokenType: tokenType ? this.getTokenType(tokenType.currentValue) : models.TokenType.Aad,
                embedUrl: embedUrl && embedUrl.currentValue,
                type: type && type.currentValue,
                id: id && id.currentValue,
            };

            this.embed(document.getElementById('powerbiFrame'), config);
        } else if (this.component) {
            this.reset(document.getElementById('powerbiFrame'));
        }

    }

    validateOptions(accessToken: string, embedUrl: string): boolean {
        if (!(typeof embedUrl === 'string' && embedUrl.length > 0)
            || !(typeof accessToken === 'string' && accessToken.length > 0)
        ) {
            return false;
        }
        return true;
    }

    getTokenType(tokenType: string): models.TokenType {
        if (!tokenType || tokenType.length < 0) {
            return models.TokenType.Aad;
        } else {
            tokenType = tokenType.charAt(0).toUpperCase() + tokenType.toLowerCase().slice(1);
            return models.TokenType[tokenType];
        }
    }

    embed(element: HTMLElement | null, config: IEmbedConfiguration) {
        if (element)
            this.component = this.powerBIService.embed(element, config);
    }

    reset(element: HTMLElement | null) {
        if (element)
            this.powerBIService.reset(element);
        this.component = null;
    }

    reloadPowerBI() {
        this.loadPowerBI().then();
    }

    ngOnDestroy() {
        // this.querySubscription?.unsubscribe();
    }
}
