import {Injectable} from '@angular/core';
import {Apollo, gql} from 'apollo-angular';

@Injectable()
export class UserService {
  constructor(private apollo: Apollo) {
  }
  USER_FRAGMENT = gql`
      fragment post on UserPageable {
        content {
          id,
          display_name,
          avatar,
          birthday,
          sex,
          createdAt,
          dateBecomeHit,
          user_type,
          sex,
          active
        },
        total_page,
        size,
        number,
        totalElements
      }
    `;
  GET_ALL = gql`
      query getUserMango($displayName: String, $phoneNumber: String, $active: Boolean, $type: Int, $userId: Int, $page_number: Int!,$page_size: Int!) {
        getUserMango(displayName: $displayName, phoneNumber: $phoneNumber, active: $active, type: $type, userId: $userId, page_number: $page_number, page_size: $page_size) {
          ...post
        }
      }
      ${this.USER_FRAGMENT}
    `;


  getAllNotification(username?: string, pageNumber?: number, pageSize?: number) {
    const USET_FRAGMENT = gql`
      fragment post on UserPageable {
        content {
          id,
          display_name,
          avatar,
          birthday,
          sex,
          createdAt,
          dateBecomeHit,
          userType
        },
        total_page,
        size,
        totalElements
      }
    `;
    const GET_ALL = gql`
      query getUserMango($username: String, $birthday: Date, $page_number: Int!,$page_size: Int!) {
        getUserMango(username: $username, birthday: $birthday, page_number: $page_number, page_size: $page_size) {
          ...post
        }
      }
      ${USET_FRAGMENT}
    `;
    return this.apollo.watchQuery({
      query: GET_ALL,
      variables: {
        username,
        page_number: pageNumber,
        page_size: pageSize
      }
    })
  }

  updateActiveUser(userId?: number, isActive?: boolean) {
    const UPDATE_ACTIVE = gql`
      mutation activeAndDeactivateUser($user_id: Int!, $isActive: Boolean!) {
        activeAndDeactivateUser(user_id: $user_id, isActive: $isActive)
      }
    `;
    return this.apollo.mutate({
      mutation: UPDATE_ACTIVE,
      variables: {
        user_id: userId,
        isActive
      }
    })
  }
}
