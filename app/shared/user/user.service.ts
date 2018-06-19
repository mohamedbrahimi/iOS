
import { Injectable, OnInit } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import * as FileSystem from "file-system";


import { User } from "./user";
import { Config } from "../config";

@Injectable()
export class UserService implements OnInit {
  ngOnInit() {


  }
  constructor(private http: Http) { }
  authentifier(user: User, code: string) {
    let headers = new Headers();

    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = "userId=" + user.email + "&Pwd=" + user.password + "&code=" + code;

    return this.http.post(Config.oauthAddress + '/oauth/code', body, { headers: headers });
  }
  sendCode(username: string, code: string) {
    console.log("user is " + username + "code is " + code);
    let headers = new Headers();

    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic Y2xpZW50bW9iaWxlOm9yY2FAMjAxOA==");

    const body = "grant_type=password&username=" + username + "&password=" + code;

    return this.http.post(Config.oauthAddress + '/oauth/login', body, { headers: headers });
  }
  refreshLogin(refresh_token) {
    let headers = new Headers();

    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic Y2xpZW50bW9iaWxlOm9yY2FAMjAxOA==");

    const body = "grant_type=refresh_token&refresh_token=" + refresh_token;

    return this.http.post(Config.oauthAddress + '/oauth/refresh', body, { headers: headers });
  }


  public getInfo(accessToken: string) {
    let headers = new Headers();
    headers.append("token", accessToken);
    return this.http.get(Config.apiAddress + "/clients/info", { headers: headers });
  }



  handleErrors(error: Response) {

    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
  public getIp(): string {
    let ip: string;
    this.http.get("http://freegeoip.net/json/")
      .map(data => {
        ip = data.json().ip;
        console.log(data.json().ip);


      });

    return ip;

  }
}