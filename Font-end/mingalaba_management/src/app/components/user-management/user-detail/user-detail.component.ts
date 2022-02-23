import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {UserService} from '../shared/user.service';
import {Apollo} from 'apollo-angular';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/internal/operators';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailComponent implements OnInit {

  data$?: any;
  id?: number;
  constructor(private userService: UserService, private apollo: Apollo, private router: Router, private activatedRoute: ActivatedRoute) {
    this.id = +this.activatedRoute.snapshot.params.id;
  }

  ngOnInit(): void {
    this.data$ = this.apollo.watchQuery({
      query: this.userService.GET_ALL,
      variables :{
        userId: this.id,
        displayName: null,
        active: null,
        phoneNumber: null,
        type: null,
        page_number: 0,
        page_size: 10
      }
    }).valueChanges.pipe(
      map((next: any) => {
        const data: any = Object.values(next.data)[0];
        return data && data?.content.length > 0 ? data.content[0] : null
      })
    );
    this.data$.subscribe((next: any) => {
      console.log(next);
    });
  }

}
