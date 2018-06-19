import { PreloadAllModules, Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { HomeComponent } from "~/home/home.component";
import { VirementComponent } from "~/virement/virement.component";
import { VirementMotifComponent } from "~/virement-motif/virement-motif.component";

const APP_ROUTES: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "feedback",
    loadChildren: "./feedback/feedback.module#FeedbackModule"
  },
  {
    path: "acceuil",
    loadChildren: "./acceuil/acceuil.module#AcceuilModule"
  },
  {
    path: "input",
    loadChildren: "./input/input.module#InputModule"
  },
  {
    path: "firebase",
    loadChildren: "./firebase/firebase.module#FirebaseModule"
  },
  {
    path: "virement",
    loadChildren: "./virement/virement.module#VirementModule"
  },
  {
    path: "virementMotif",
    component: VirementMotifComponent
  },
];

// TODO swap
export const routing = NativeScriptRouterModule.forRoot(APP_ROUTES, { preloadingStrategy: PreloadAllModules });
