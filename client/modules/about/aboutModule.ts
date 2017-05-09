import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ANGULARCLASS_FORM_VALIDATOR_DIRECTIVES } from '@angularclass/form-validators';

import { AboutComponent } from './about.component';
import {AboutRoutingModule} from "./about-routing.module";

/*export const ROUTER_CONFIG = [
  { path: '', component: About, pathMatch: 'full' }
];*/

@NgModule({
  declarations: [
    AboutComponent,
    ...ANGULARCLASS_FORM_VALIDATOR_DIRECTIVES
  ],
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class AboutModule {
  //static routes = ROUTER_CONFIG;
}

