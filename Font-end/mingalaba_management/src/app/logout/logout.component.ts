import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { environment } from '../../environments/environment';
import { OAuth2AuthenticationDto } from '@next-solutions/next-solutions-base';
import {SubscriptionService} from '../_services/subscription.service';
import {SubscriptionClient} from 'subscriptions-transport-ws';

@Component({
  selector: 'app-logout',
  template: ``,
  styles: [``],
})
export class LogoutComponent implements OnInit {
  wsc!: SubscriptionClient;
  constructor(private loginComponent: LoginComponent,
              private subService: SubscriptionService) {
    this.wsc = this.subService.getWSClient();
  }

  ngOnInit() {
    window.sessionStorage.removeItem('token');
    window.sessionStorage.removeItem('distributorCode');
    window.sessionStorage.removeItem('userName');
    this.wsc.close(false, false);
    const dlgRef = this.loginComponent.showLoginModal();
    
    dlgRef.afterClosed().subscribe(() => {
      // this.onMouseLeave();
    });
  }
}
