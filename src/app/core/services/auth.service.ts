import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  requestedUrl = '';

  public authTokenStale: string = 'stale_auth_token';
  public authTokenNew: string = 'new_auth_token';
  public currentToken: string;

  private newToken = ' ';
  private current_token: string;
  private refresh_token: string = localStorage.getItem('environment.dataKey');


  constructor(private http: HttpClient, private route: Router) {
    this.currentToken = this.authTokenStale;
  }

  getAuthToken() {
    let data: any = localStorage.getItem(environment.dataKey);
    if (data) {
      data = JSON.parse(atob(data));
      this.currentToken = data;
    }
    return this.currentToken;
  }




  login(model) {
    return this.http.post(`${environment.baseUrl}/auth/api/v1/user/authenticate`, model);
    // return this.http.post(`${environment.baseUrl}/auth/api/v1/user/authenticate`, {userName:"string",password:"string"});
  }


  refreshToken() {
    return this.http.get(`${environment.baseUrl}/auth/api/v1/user/refreshtoken`);
    // return this.http.post(`${environment.baseUrl}/api/v1/user/refreshtoken`, token);
  }

  logout() {
    localStorage.clear();
    this.route.navigate(['/login']);
  }

  getDecodedAccessToken(data: string): any {
    try {
      return jwt_decode(data);
    } catch (Error) {
      return null;
    }
  }
}
