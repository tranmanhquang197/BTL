import {Injectable} from '@angular/core';
import {HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ApiService} from '@next-solutions/next-solutions-base';
import {Apollo, gql} from 'apollo-angular';
import {tap} from 'rxjs/internal/operators';

const LOGIN_APOLLO = gql`
  mutation login($username: String!, $password: String!, $type: String!) {
    login(username: $username, password: $password, type: $type) {
      id,
      email,
      username,
      jwt
    }
  }
`;

@Injectable()
export class AuthenticationService {
  constructor(private apiService: ApiService, private apollo: Apollo) {
  }

  login(username:any,password:any) {


    const headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');
    const body = {
      username,
      password
    }
    return this.apiService.post('' , body, {}, 'http://localhost:9090/api/user/login');

  }

  register(username:any,password:any) {
    const headers = new HttpHeaders().set('Content-type', 'application/x-www-form-urlencoded');
    const body = {
      username,
      password
    }
    return this.apiService.post('' , body, {}, 'http://localhost:9090/api/user/register');

  }

  loginChat(username?: string, password?: string) {
    const body = {
      type: 'm.login.password',
      password,
      identifier: {
        type: 'm.id.user',
        user: username
      }
    };
    const headers = new HttpHeaders().set('Content-type', 'application/json');
    return this.apiService.post('/_matrix/client/r0/login', body,{headers}, environment.CHAT_SERVER_URL);
  }

  isAuthenticated() {
    if (window.sessionStorage.getItem('token') != null) {
      return true;
    }
    return false;
  }

  loginApolloServer(username: string, token: string) {
    return this.apollo.mutate({
      mutation: LOGIN_APOLLO,
      variables: {
        username,
        password: token,
        type: 'mingalaba'
      }
    })
      .pipe(tap(data => console.log(data)))
  }
}
