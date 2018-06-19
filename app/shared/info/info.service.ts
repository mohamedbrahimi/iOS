import { Injectable, OnInit } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpHeaders, HttpClientModule, HttpClient } from '@angular/common/http';


import { Info } from "./info";
import { Config } from "../config";


@Injectable()
export class InfoService implements OnInit {
  ngOnInit() {

  }
  constructor(private http: Http) { }
  demanderInfo(info: Info, token) {
    let headers = new Headers();


    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", token);


    return this.http.get(Config.oauthAddress + "/oauth/info", { headers: headers })
      .catch(this.handleErrors);
  }

  getCommonHeaders() {
    let headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("Authorization", "Basic c0xPUEthRXNDc0JoTmRzVGdRTExJVDlZeVpVU1FveVJ1bW5VcmI0NFAzdURsaWNZdHY1MVkxazlCdHpVNGVIVzpjMHhQVUV0aFJYTkRjMEpvVG1SelZHZFJURXhKVkRsWmVWcFZVMUZ2ZVZKMWJXNVZjbUkwTkZBemRVUnNhV05aZEhZMU1Wa3hhemxDZEhwVk5HVklWenB3VHpaSE5raHBkRkYzVldWSE9FNXZhMjl2VkZwVFNWaElSV1ZpZEhoUFRtbGxibE5FU2xkcFoxazJlbUo1YW0xeU1VOVNUSEo1Y210dWJHMVhVM1pZ");
    return headers;
  }

  handleErrors(error: Response) {

    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}