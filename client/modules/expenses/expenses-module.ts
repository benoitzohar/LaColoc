import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ExpensesComponent} from './expenses.component';
import {ExpensesRoutingModule} from "./expenses-routing.module";
import {CommonModule} from "@angular/common";
import {ExpensesComponent} from "./expenses.component";

/*export const ROUTER_CONFIG = [
  {path: '', component: Home, pathMatch: 'full'},
  {path: 'expenses', component: Expenses},
];*/

@NgModule({
  imports: [CommonModule],
  declarations: [
    ExpensesComponent
  ],
})
export class ExpensesModule {
}

