import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";

import { VirementRoutingModule } from "./virement-routing.module";
import { VirementComponent } from "./virement.component";
import { TNSFontIconModule } from "nativescript-ngx-fonticon";
import { NativeScriptUIDataFormModule } from "nativescript-ui-dataform/angular/dataform-directives";
import { CommonDirectivesModule } from "~/shared/directives/common-directives.module";
@NgModule({
  imports: [
    NativeScriptCommonModule,
    VirementRoutingModule,
    TNSFontIconModule,
    NativeScriptUIDataFormModule,
    CommonDirectivesModule
  ],
  declarations: [
    VirementComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA
  ]
})
export class VirementModule { }
