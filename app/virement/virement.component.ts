import { Component, ViewContainerRef, ViewChild } from "@angular/core";
import { trigger, query, stagger, style, animate, transition, state } from "@angular/animations";
import { AbstractMenuPageComponent } from "../abstract-menu-page-component";
import { FeedbackHelper } from "../helpers/feedback-helper";
import { FancyalertHelper } from "../helpers/fancyalert-helper";
import { ModalDialogService } from "nativescript-angular";
import { PluginInfo } from "../shared/plugin-info";
import { PluginInfoWrapper } from "../shared/plugin-info-wrapper";
import { CFAlertDialogHelper } from "../helpers/cfalertdialog-helper";
import { AppComponent } from "~/app.component";
import { Virement } from "~/shared/virement/virement";
import { Compte } from "~/shared/compte/compte";
import { UserService } from "~/shared/user/user.service";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import { Config } from "~/shared/config";
import { ListPicker } from "tns-core-modules/ui/list-picker/list-picker";
import { RadDataFormComponent } from "nativescript-ui-dataform/angular";
import { VirementData } from "./virementData";



@Component({
  selector: "page-virement",
  moduleId: module.id,
  providers: [UserService],
  templateUrl: "./virement.component.html",
  styleUrls: ["virement-common.css"],
  animations: [
    trigger("from-bottom", [
      state("in", style({
        "opacity": 1,
        transform: "translateY(0)"
      })),
      state("void", style({
        "opacity": 0,
        transform: "translateY(20%)"
      })),
      transition("void => *", [animate("1600ms 700ms ease-out")]),
      transition("* => void", [animate("600ms ease-in")])
    ]),
    trigger("fade-in", [
      state("in", style({
        "opacity": 1
      })),
      state("void", style({
        "opacity": 0
      })),
      transition("void => *", [animate("800ms 2000ms ease-out")])
    ]),
    trigger("scale-in", [
      state("in", style({
        "opacity": 1,
        transform: "scale(1)"
      })),
      state("void", style({
        "opacity": 0,
        transform: "scale(0.9)"
      })),
      transition("void => *", [animate("1100ms ease-out")])
    ]),
    trigger("flyInOut", [
      state("in", style({ transform: "scale(1)", opacity: 1 })),
      transition("void => *", [
        style({ transform: "scale(0.9)", opacity: 0 }),
        animate("1000ms 100ms ease-out")
      ])
    ]),
    trigger("from-right", [
      state("in", style({
        "opacity": 1,
        transform: "translate(0)"
      })),
      state("void", style({
        "opacity": 0,
        transform: "translate(20%)"
      })),
      transition("void => *", [animate("600ms 1500ms ease-out")])
    ])
  ]

})
export class VirementComponent extends AbstractMenuPageComponent {
  fancyAlertHelper: FancyalertHelper;
  cfalertDialogHelper: CFAlertDialogHelper;
  feedbackHelper: FeedbackHelper;
  virement: Virement;
  typeVirement: String;
  virementInterne: boolean;
  comission;
  compte: Compte;
  justificatif;
  unit;
  numCompteExterne;
  balance;
  comptes: Array<any>; balanceAfter: number;
  monNumCompte;


  get virementData(): VirementData {
    return this._virementData;
  }
  private _virementData: VirementData;
  @ViewChild("myDataForm") dataFormComp: RadDataFormComponent;

  constructor(protected appComponent: AppComponent,
    protected vcRef: ViewContainerRef,
    protected modalService: ModalDialogService,
    private router: Router, private route: ActivatedRoute,
    private userService: UserService) {

    super(appComponent, vcRef, modalService);
    this.fancyAlertHelper = new FancyalertHelper();
    this.cfalertDialogHelper = new CFAlertDialogHelper();
    this.feedbackHelper = new FeedbackHelper();
    this.comptes = [];
  }

  ngOnInit() {
    this.virement = new Virement();
    this._virementData = new VirementData();
    this.getComptesInfo();
    this.comission = "1%";
  }



  getComptesInfo = () => {
    this.userService.getInfo(Config.access_token)
      .subscribe(
        (res) => {
          res = res.json();
          let i = 0;
          while (res["comptes"][i] != null) {
            this.compte = new Compte();
            this.compte.numCompte = res["comptes"][i]["Num"];
            this.compte.etat = res["comptes"][i]["Etat"];
            this.compte.balance = res["comptes"][i]["Balance"];
            this.compte.type = res["comptes"][i]["TypeCompte"];
            console.log(this.compte.numCompte);
            console.log(this.compte.balance);
            console.log(this.compte.etat);
            this.comptes.push(this.compte);
            if (i === 0) {

              this.balance = new String();
              this.balance = res["comptes"][i]["Balance"];
              this.monNumCompte = res["comptes"][i]["Num"];
              console.log("Votre balance" + this.balance);
            }
            console.log(res["comptes"][i]["TypeCompte"]);
            i++;
          }


        },
        (error) => {

          this.feedbackHelper.showError("Erreur", "Chargement de donnée échoué");
          console.log("virement erreur getInfo: " + error);
        });

  }

  selectedIndexChanged(args) {
    let i = 0;
    const picker = <ListPicker>args.object;
    console.log("picker selection: " + picker.selectedIndex);

    if (this.virement.emetteur === "0") {
      i = picker.selectedIndex + 1;
      this.virement.destinataire = i.toString();
    } else {
      this.virement.destinataire = "0";
    }
  }

  Next() {
    let isValid = true;

    let p1 = this.dataFormComp.dataForm.getPropertyByName("numCompte");

    if (p1.valueCandidate === this.monNumCompte) {
      p1.errorMessage = "Vous ne pouvez pas virez vers le méme compte";
      this.dataFormComp.dataForm.notifyValidated("numCompte", false);
      isValid = false;
    } else {
      this.dataFormComp.dataForm.notifyValidated("numCompte", true);
    }

    let hasErrors = this.dataFormComp.dataForm.hasValidationErrors();
    if (hasErrors) {
      this.feedbackHelper.showError("Erreur de Remplissage du formulaire!", "Veuillez Remplir tous les champs correctement pour continuer");
    }
    else {
      if (this._virementData.montant > 200000) {
        this.justificatif = 1;
      }
      else {
        this.justificatif = 0;
      }
      let navigationExtras: NavigationExtras;
      navigationExtras = {
        queryParams: {
          "'destinataire'": this._virementData.numCompte,
          "'montant'": this._virementData.montant,
          "'justificatif'": this.justificatif
        }
      };
      this.router.navigate(["/virementMotif"], navigationExtras);
    }
  }

  liveBalance(i): String {
    ////////// Appelez un service de simulation BackEnd pour aboutir aux balances si le virement est effictué
    return (this.balance - this._virementData.montant - 0.1 * this.balance).toString();
  }
  protected getPluginInfo(): PluginInfoWrapper {
    return new PluginInfoWrapper(
      "Add some 💥 to your app by going beyond the default alert. So here's a couple of alternative ways to feed something back to your users.",
      Array.of(
        new PluginInfo(
          "nativescript-feedback",
          "Feedback",
          "https://github.com/EddyVerbruggen/nativescript-feedback",
          "Non-blocking textual feedback with custom icons and any colors you like. Tap to hide these babies."
        ),

        new PluginInfo(
          "nativescript-toast",
          "Toast",
          "https://github.com/TobiasHennig/nativescript-toast",
          "A sober way of providing non-blocking feedback."
        )
      )
    );
  }

}
