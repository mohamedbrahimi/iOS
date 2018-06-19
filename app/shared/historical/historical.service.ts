import { Injectable, OnInit } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { Historical } from "./historical";
import { Config } from "../config";

@Injectable()
export class HistoricalService implements OnInit {

    constructor(private http: Http) { }

    ngOnInit() { }

    getHistorical(accessToken: string) {
        let headers = new Headers();
        headers.append("token", accessToken);
        return this.http.get(Config.apiAddress + "/clients/historique", { headers: headers });
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}