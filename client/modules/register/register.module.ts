import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RegisterComponent} from "./register.component";
import {UserService} from "../../services/user.service";

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [
    RegisterComponent
  ],
  exports: [RegisterComponent],
  providers: [UserService]
})
export class RegisterModule {
}

