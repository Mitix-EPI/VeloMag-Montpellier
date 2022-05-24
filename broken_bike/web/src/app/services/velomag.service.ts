import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class VelomagService {

  URL = 'http://velomag.chickenkiller.com:55555/';
  username: string = "";
  password: string = "";
  isAdmin: boolean = false;

  constructor(private httpClient: HttpClient, private cookieService: CookieService) {
    this.username = this.cookieService.get('username');
    this.password = this.cookieService.get('password');
    if (this.username.length > 0 && this.password.length > 0) {
      this.isAdmin = true;
    }
  }

  login(username: string, password: string) {
    return this.httpClient.post(this.URL + 'login', { username, password });
  }

  saveLogin(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.cookieService.set('username', username);
    this.cookieService.set('password', password);
    this.isAdmin = true;
  }

  clearLogin() {
    this.username = "";
    this.password = "";
    this.cookieService.delete('username');
    this.cookieService.delete('password');
    this.isAdmin = false;
  }

  getBikes() {
    return this.httpClient.get(this.URL + 'get_bikes');
  }

  removeBike(id: number) {
    return this.httpClient.post(this.URL + 'remove_bike/' + id.toString(), {});
  }

}
