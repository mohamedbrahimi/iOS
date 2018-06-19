import { BehaviorSubject } from "rxjs/BehaviorSubject";

export class Virement {
    dateV: string;
    emetteur: string;
    destinataire: string;
    montant: number;
    motif: string;
    status: string;

    constructor() { }
}