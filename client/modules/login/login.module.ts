import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login.component';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [
    LoginComponent
  ],
  exports: [LoginComponent]
})
export class LoginModule {
}

