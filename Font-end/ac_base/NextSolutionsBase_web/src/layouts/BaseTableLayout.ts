import { ButtonClickModel } from '../models/button.click.model';
import { OAuth2AuthenticationDto } from '../models/oauth/oAuth2AuthenticationDto';
import { ActivatedRoute } from '@angular/router';
import { AuthoritiesService } from '../services/authorities.service';

export class BaseTableLayout {
  me: OAuth2AuthenticationDto | null = null;

  constructor(protected activatedRoute: ActivatedRoute, protected authoritiesService: AuthoritiesService) {
    if (!this.authoritiesService.me && this.activatedRoute.snapshot.data) {
      this.me = this.activatedRoute.snapshot.data['me'];
    }
    if (!!this.authoritiesService.me) {
      this.me = this.authoritiesService.me;
    }
    if (!!this.me) {
      this.authoritiesService.me = this.me;
      this.authoritiesService.stateMe.next(this.me);
    }
  }

  onRowButtonClick(event: ButtonClickModel) {
    const window = this as any;
    if (window[event.action]) {
      window[event.action](event.object, event.index);
    }
  }
}
