
import { Injectable, OnInit } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from 'rxjs/Observable';
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import * as FileSystem from "file-system";


import { Compte } from "./compte";
import { Config } from "../config";

@Injectable()
export class CompteService implements OnInit {
  ngOnInit() {

  }
  constructor(private http: Http) { }
  createAccount(acces_token: string, type: string) {
    let headers = new Headers();

    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.append("token", acces_token as string);
    const body = "Type=" + type;
    return this.http.post(Config.apiAddress + '/accounts/new', body, { headers: headers });
  }
  getTauxDeChange(acces_token: string, base: string) {
    let headers = new Headers();
    headers.append("token", acces_token as string);
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    const body = "base=" + base;
    return this.http.post(Config.apiAddress + '/clients/tauxChange', body, { headers: headers });

  }

  handleErrors(error: Response) {

    console.log(JSON.stringify(error.json()));
    return Observable.throw(error);
  }
}