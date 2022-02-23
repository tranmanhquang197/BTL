import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

@Injectable()
export class UsersService {
  constructor(private apollo: Apollo) {
  }

  GET_USER_DETAIL = gql`
      query user($id: Int!,$email: String) {
        user(id: $id, email: $email) {
          display_name
          avatar
          birth_date
          follower
          follow_me
          comment
          post
          like
          share
          address
          gender
          username 
          address
           }
      }
    `;




}
