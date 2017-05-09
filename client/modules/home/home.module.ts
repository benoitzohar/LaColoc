import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from "./home-routing.module";
import {CommonModule} from "@angular/common";
import {LoginComponent} from "../login/login.component";
import {LoginModule} from "../login/login.module";
import {RegisterModule} from "../register/register.module";
import {GroupComponent} from "../groups/create-group/group.component";
import {GroupModule} from "../groups/create-group/group.module";
import {GroupListComponent} from "../groups/group-list/group-list.component";
import {GroupListModule} from "../groups/group-list/group-list.module";

@NgModule({
  imports: [
    CommonModule,
    LoginModule,
    RegisterModule,
    GroupListModule
  ],
  declarations: [
    HomeComponent
  ],

})
export class HomeModule {
}
