import { NgModule } from '@angular/core';

import { NativeScriptRouterModule } from "nativescript-angular/router";

import { TKExampleTitleDirective } from './example.directive';
import { TKIfAndroidDirective, TKIfIOSDirective } from './platform.directives';

@NgModule({
    declarations: [
        TKExampleTitleDirective,
        TKIfAndroidDirective,
        TKIfIOSDirective
    ],
    exports: [
        TKExampleTitleDirective,
        TKIfAndroidDirective,
        TKIfIOSDirective
    ]
})
export class CommonDirectivesModule { }