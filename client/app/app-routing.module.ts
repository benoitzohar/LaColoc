import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from '../modules/home/home.component';
import {AboutComponent} from '../modules/about/about.component';
import {ExpensesComponent} from '../modules/expenses/expenses.component';
import {GroupComponent} from '../modules/groups/group/group.component';
import {LoginComponent} from '../modules/login/login.component';
import {AuthGuard} from '../services/auth-guard.service';
import {PageNotFoundComponent} from "./page-not-found.component";
import {RegisterComponent} from "../modules/register/register.component";

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  /*{path: 'register', component: RegisterComponent},*/
  /*{path: 'login', component: LoginComponent},*/
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
  { path: 'group', component: GroupComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {
}
