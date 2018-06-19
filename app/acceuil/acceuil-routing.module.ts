
import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { AcceuilComponent } from "./acceuil.component";

const routes: Routes = [
  { path: "", component: AcceuilComponent }
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule]
})
export class AcceuilRoutingModule {
}
