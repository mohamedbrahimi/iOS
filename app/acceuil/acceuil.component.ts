import { Component, ViewContainerRef, OnInit, AfterViewInit } from "@angular/core";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { AbstractMenuPageComponent } from "../abstract-menu-page-component";
import { Feedback } from "nativescript-feedback";
import { ToastService } from "../services/toast.service";
import { ToastHelper } from "../helpers/toast-helper";
import { FeedbackHelper } from "../helpers/feedback-helper";
import { FancyalertHelper } from "../helpers/fancyalert-helper";
import { ModalDialogService } from "nativescript-angular";
import { SnackbarHelper } from "../helpers/snackbar-helper";
import { LocalNotificationsHelper } from "../helpers/localnotifications-helper";
import { PluginInfo } from "../shared/plugin-info";
import { PluginInfoWrapper } from "../shared/plugin-info-wrapper";
import { CFAlertDialogHelper } from "../helpers/cfalertdialog-helper";
import { Page, EventData, ContentView } from "ui/page";
import { isAndroid, isIOS, device, screen } from "platform";
import { UserService } from "../shared/user/user.service";
import { User } from "../shared/user/user";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { InfoService } from "../shared/info/info.service";
import { Info } from "../shared/info/info";
import { TabView, SelectedIndexChangedEventData } from "ui/tab-view";
import * as dialogs from "ui/dialogs";
import { Compte } from "../shared/compte/compte";
import { CompteService } from "../shared/compte/compte.service";
import { Config } from "../shared/config";
import { registerElement } from "nativescript-angular/element-registry";
import { NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { AppComponent } from "~/app.component";
import { SocketIO } from "nativescript-socketio";
import * as LocalNotifications from "nativescript-local-notifications";
const TokentTest = "VfziQohwoRBpEAQmbuD3zv0xk34tXSOB4Boe0fBgHEkxJIiacwg83eX3ebhqnhqrfsFxrJvgovIp3kyGXQB3ZbHKKQkaBpA3MKLD4AvE6jO1wYpzIxnHCrhcrhSde6kCFRqYz5ssEn0Q0zg0FrYILxtGKIgTfDs5lDNEJGNcUIHSEAloxUY42JE1BBF3MpDbGvk3os0XWT82PdzQXHn9MsDGf5iUi8WrXIC2h0nAFJMg1AAci6VsQmhKJuQDtQI";
@Component({
    selector: "acceuil",
    moduleId: module.id,
    templateUrl: "./acceuil.component.html",
    providers: [UserService, InfoService, CompteService],
    styleUrls: ["acceuil-common.css"],
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
export class AcceuilComponent extends AbstractMenuPageComponent implements OnInit, AfterViewInit {
    fancyAlertHelper: FancyalertHelper;
    cfalertDialogHelper: CFAlertDialogHelper;
    feedbackHelper: FeedbackHelper;
    localNotificationsHelper: LocalNotificationsHelper = new LocalNotificationsHelper();
    snackbarHelper: SnackbarHelper;
    toastHelper: ToastHelper;
    Dollar: String;
    Euro: String;
    refreshToken;
    accessToken;
    expires;
    user: User;
    info: Info;
    comptes: Array<any>;
    titles: Array<any>;
    cmpt1: Compte;
    cmpt2: Compte;
    cmpt3: Compte;
    cmpt4: Compte;
    compte: Compte;
    title: String;
    compteEpargne = false;
    compteEuro = false;
    compteDolar = false;
    virementInterne = false;
    choice: string = "";
    cpt = 0;
    init = 0;
    myIndex;




    constructor(protected menuComponent: AppComponent,
        protected vcRef: ViewContainerRef,
        protected modalService: ModalDialogService,
        private toastService: ToastService, private router: Router, private route: ActivatedRoute,
        private userService: UserService, private compteService: CompteService,
        private ngZone: NgZone, private socketIO: SocketIO) {
        super(menuComponent, vcRef, modalService);
        this.comptes = [];
        this.titles = [];
        this.fancyAlertHelper = new FancyalertHelper();
        this.cfalertDialogHelper = new CFAlertDialogHelper();
        this.feedbackHelper = new FeedbackHelper();
        this.localNotificationsHelper = new LocalNotificationsHelper();
        this.snackbarHelper = new SnackbarHelper();
        this.toastHelper = new ToastHelper(this.toastService);
        this.myIndex = 3;

    }
    ngOnInit(): void {

        this.login(Config.access_token);
        this.localNotificationsHelper = new LocalNotificationsHelper();
        this.user = new User(1);
        this.init = 0;
        this.route.queryParams.subscribe((params) => {
            this.accessToken = params["access_token"];
            this.refreshToken = params["refresh_token"];
            this.expires = params["expires"];
        });
        this.getTauxDechange('USD');
        this.getTauxDechange('EUR');
        ////////////////////////////////
        let self = this;
        this.socketIO.on('notification', function (message) {
            self.feedbackHelper.showInfo("Notification Tharwa", message);
            self.localNotificationsHelper.showWithSound("Notification Tharwa", message as string);
            self.getComptesInfo();
        });
    }

    getComptesInfo() {
        this.userService.getInfo(Config.access_token)
            .subscribe(
                (res) => {
                    res = res.json();
                    let i = 0;
                    while (res["comptes"][i] != null) {
                        this.compte = new Compte();
                        this.compte.numCompte = res["comptes"][i]["Num"];
                        this.compte.etat = res["comptes"][i]["Etat"];
                        this.compte.type = res["comptes"][i]["TypeCompte"];
                        switch (this.compte.type) {

                            case 0: this.compte.balance = res["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " DZD";
                                break;
                            case 1: this.compte.balance = res["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " DZD";
                                break;
                            case 2: this.compte.balance = res["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " EUR";
                                break;
                            case 3: this.compte.balance = res["comptes"][i]["Balance"].toFixed(2).replace(/./g, function (c, i, a) {
                                return i && c !== "." && ((a.length - i) % 3 === 0) ? ' ' + c : c;
                            }) + " USD";
                                break;
                        }


                        console.log(this.compte.numCompte);
                        console.log(this.compte.balance);
                        console.log(this.compte.etat);
                        this.comptes.push(this.compte);
                        console.log(res["comptes"][i]["TypeCompte"]);
                        i++;
                    }
                    console.log(res["comptes"][0]["Num"]);



                },
                (error) => {
                    this.feedbackHelper.showError("Erreur de chargement des comptes", "Vérifiez votre connexion");
                    console.log("home erreur getInfo: " + error);
                });

    }

    ngAfterViewInit() {

        this.getComptesInfo();
    }

    public onIndexChanged(args) {
        let tabView = <TabView>args.object;
        console.log("Selected index changed! New inxed: " + tabView.selectedIndex);
        this.myIndex = tabView.selectedIndex;
    }


    virement(accountType: number) {
        dialogs.action({
            title: "Type Virement",
            message: "Veuillez choisir le type de virement à effectuer",
            cancelButtonText: "ANNULER",
            actions: ["Virement vers un de mes comptes", "Virement Externe"]
        }).then((result) => {
            let navigationExtras: NavigationExtras;
            if (result === "Virement vers un de mes comptes") {
                this.virementInterne = true;
                navigationExtras = {
                    queryParams: {
                        "'virementInterne'": this.virementInterne,
                        "'accountType'": accountType,
                    }
                };
                this.router.navigate(["/virement"], navigationExtras);
            }
            if (result === "Virement Externe") {
                if (accountType === 0) {
                    this.virementInterne = false;
                    navigationExtras = {
                        queryParams: {
                            "'virementInterne'": this.virementInterne
                        }
                    };
                    this.router.navigate(["/virement"], navigationExtras);
                }
                else {
                    this.fancyAlertHelper.showWarning("Opération Non autorisée", "Vous pouvez faire un virement Externe a partir d'un compte Courant seulement");
                }
            }

        });
    }

    goProfile() {
        this.router.navigate(["/profile"]);
    }
    fabTap() {

        dialogs.action({
            title: "Confirmation",
            message: "Veuillez choisir le type du compte que vous voullez creer.",
            cancelButtonText: "ANNULER",
            actions: ["Compte Epargne", "Compte Devise EURO", "Compte Devise DOLLAR"]
        }).then((result) => {
            if (result === "Compte Epargne") {
                this.choice = "1";
                this.compteEpargne = true;
                this.submit();

            }
            if (result === "Compte Devise EURO") {
                this.choice = "2";
                this.compteEuro = true;
                this.submit();
            }
            if (result === "Compte Devise DOLLAR") {
                this.choice = "3";
                this.compteDolar = true;
                this.submit();
            }
        });

    }
    submit() {
        this.compteService.createAccount(Config.access_token, this.choice)
            .subscribe(response => {
                //    response = response.json();
                this.compte = new Compte();
                this.compte.numCompte = response["Num"];
                this.compte.balance = response["Balance"];
                this.compte.dateCreation = response["DateCreation"];
                this.compte.monnaie = response["CodeMonnaie"];
                this.compte.beneficiaire = response["IdUser"];
                this.compte.etat = response["etat"];
                this.compte.type = response["TypeCompte"];



                this.comptes.push(this.compte);
                /*
                                var card: C ardComponent = new CardComponent(this.compte);
                                this.tabList.push(card);*/
            },
                (error) => {
                    console.log(error, "Test");
                    //   this.feedbackHelper.showError();
                    alert("Creation annulé" + JSON.stringify(error));
                });
    }
    getAccountStyle(i): String {
        if (this.comptes[i].etat === 0) {
            return "#cec6c6";
        }
        else {


            if (this.comptes[i].type === 0) {
                return "#900c3f";

            }
            else if (this.comptes[i].type === 1) {
                return "#c70039";
            }
            else if (this.comptes[i].type === 2) {
                return "#e29e9e";
            }
            else if (this.comptes[i].type === 3) {
                return "#D19B76";
            }
        }
    }
    getTitles(i) {
        if (this.comptes[i].type === 0) {
            return "Courant";

        }
        else if (this.comptes[i].type === 1) {
            return "Epargne";
        }
        else if (this.comptes[i].type === 2) {
            return "Euro";
        }
        else if (this.comptes[i].type === 3) {
            return "Dollar";
        }
    }
    onTabViewLoaded(event: EventData) {
        const tabView = <any>event.object;
        this.getComptesInfo();
        //  this.feedbackHelper.showSuccess();

    }
    getTauxDechange(base) {
        let result: String = new String();

        setInterval(() => {
            this.compteService.getTauxDeChange(Config.access_token, base)
                .subscribe(
                    (res) => {
                        res = res.json();
                        if (base === "USD") {
                            let data = res["Taux"];

                            this.Euro = "1$ = " + data[1] + "DZD";

                        }
                        else if (base === "EUR") {
                            let data2 = res["Taux"];
                            this.Dollar = "1€ = " + data2[1] + "DZD";

                        }
                    },
                    (error) => {
                        // this.feedbackHelper.showError();
                        console.log("home erreur TauxDeChange: " + error);
                    });

        }, 3600 * 1000);

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
                ),

                new PluginInfo(
                    "nativescript-cfalert-dialog",
                    "CFAlert Dialog",
                    "https://github.com/shiv19/nativescript-cfalert-dialog",
                    "Need an Alert, notification, or bottom dialog? Then this one's for you!"
                ),

                new PluginInfo(
                    "nativescript-fancyalert",
                    "FancyAlert",
                    "https://github.com/NathanWalker/nativescript-fancyalert",
                    "Want to get in your user's face? Throw a highly customizable alert at them."
                ),

                new PluginInfo(
                    "nativescript-snackbar",
                    "Snackbar  🍭 🍫",
                    "https://github.com/bradmartin/nativescript-snackbar",
                    "Use a Material Design Snackbar in your app."
                ),

                new PluginInfo(
                    "nativescript-local-notifications",
                    "Local Notifications",
                    "https://github.com/EddyVerbruggen/nativescript-local-notifications",
                    "Show notifications when your app is inactive 😴. Much like push notifications, but without a server."
                )
            )
        );
    }

    login(token: String) {
        this.socketIO.emit("connexion", token);
    }


    logout() {
        this.socketIO.emit('deconnexion', 'Salut serveur, ça va ?');
    }
}
