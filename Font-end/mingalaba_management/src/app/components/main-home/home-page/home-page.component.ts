import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NavService} from '../../../_services/nav.service';
import {Apollo, gql} from 'apollo-angular';

export const CREATE_LINK_MUTATION = gql`
  # 2
  mutation {
login(
username:"@du1:demo.nextsolutions.com.vn",
password:"MDAyN2xvY2F0aW9uIGRlbW8ubmV4dHNvbHV0aW9ucy5jb20udm4KMDAxM2lkZW50aWZpZXIga2V5CjAwMTBjaWQgZ2VuID0gMQowMDMxY2lkIHVzZXJfaWQgPSBAZHUxOmRlbW8ubmV4dHNvbHV0aW9ucy5jb20udm4KMDAxNmNpZCB0eXBlID0gYWNjZXNzCjAwMjFjaWQgbm9uY2UgPSBhM34xZ0Q6NFNpeWZZcWp6CjAwMmZzaWduYXR1cmUgrXWnQkvXNxkGWHcbgNsexWs-uzbcKrbZNMFBZYU0bXcK"

type:"mingalaba"
) {

avatar,
username,
id,
jwt
}
}
`;

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})

export class HomePageComponent implements OnInit {
  @ViewChild('appDrawer', {static: true}) appDrawer: ElementRef | undefined;

  constructor(
    private navService: NavService,
    private apollo: Apollo,
  ) {
  }

  ngOnInit(): void {
//    this.navService.closeNav();
  }

  login() {
    console.log('login')
    this.apollo.mutate({
      mutation: CREATE_LINK_MUTATION,
      variables: {
        // description: this.description,
        // url: this.url
      }
    }).subscribe((response) => {

    });
  }

  getSchedule() {
    this.apollo
      .query<any>({
        query: gql`
          query{
getSchedules(
userId: 101
schedule_type :1
event_date:"2021-03-06"
page_number: 0
page_size: 10
paginate_flag: 1
# paginate_flag: 1 - tăng dần
# paginate_flag: 2 - giảm dần
)
{
schedules {
id
createdAt
user_id

event_title,
files{
id
file_url,
file_type

}
rooms{
id
room_id,
room_name
status
room_url
members{
id
avatar
display_name
}
}
members{
id
username
avatar
display_name
}
lat ,
lng ,
status,
address ,
scheduleTypeId ,
sound,
schedule_note
share_type
reminder_time,
event_time ,
repeat_type ,
day_of_week,
day_of_month,

subtasks{
id,
note,
status
is_completed
},
tags {
id,
name,
color,
status
}
files{
file_url
}
},
total_pages

}
}
        `
      })
      .subscribe(
        ({data}) => {
          console.log(data)
        },
        error => {
          console.log(error);
        }
      );
  }
}
