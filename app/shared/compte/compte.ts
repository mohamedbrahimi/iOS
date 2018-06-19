import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class Compte {
  numCompte: string;
  balance: string;
  beneficiaire: string;
  monnaie: string;
  dateCreation: string;
  etat: string;
  type: number;
  public constructor() { }

}