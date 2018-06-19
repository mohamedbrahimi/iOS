import { Injectable, OnInit } from "@angular/core";
import { Headers, Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

import { Virement } from "./virement";
import { Config } from "../config";

@Injectable()
export class VirementService {


    constructor(private http: Http) { }

    sendVirement(accessToken, virement: Virement) {
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        headers.append("token", accessToken);
        const body = "montant=" + virement.montant + "&type1=" + virement.emetteur + "&type2=" + virement.destinataire + "&motif=" + virement.motif;
        return this.http.post(Config.apiAddress + "/virement/local", body, { headers: headers });
    }

    handleErrors(error: Response) {
        console.log(JSON.stringify(error.json()));
        return Observable.throw(error);
    }
}