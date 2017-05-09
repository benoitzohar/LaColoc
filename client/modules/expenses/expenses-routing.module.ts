import {NgModule}            from '@angular/core';
import {RouterModule}        from '@angular/router';

import {ExpensesComponent}    from './expenses.component';
import {AuthGuard} from "../../services/auth-guard.service";

@NgModule({
  imports: [RouterModule.forChild([
    {path: 'expenses', component: ExpensesComponent},
  ])],
  exports: [RouterModule]
})
export class ExpensesRoutingModule {
}