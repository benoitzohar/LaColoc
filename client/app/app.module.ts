import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {AuthGuard} from "../services/auth-guard.service";
import {AuthService} from "../services/auth.service";
import {HomeModule} from "../modules/home/home.module";
import {GroupModule} from "../modules/groups/group/group.module";
import {LoginComponent} from "../modules/login/login.component";
import {AboutComponent} from "../modules/about/about.component";
import {ExpensesComponent} from "../modules/expenses/expenses.component";
import {PageNotFoundComponent} from "./page-not-found.component";
import {RegisterComponent} from "../modules/register/register.component";
import {ErrorHandlerService} from "../services/error-handler.helper";
import {UserService} from "../services/user.service";
import {LoginModule} from "../modules/login/login.module";
import {GroupService} from "../services/group.service";

// Create the Graphql client (with apollo)
const networkInterface = createNetworkInterface({ uri: 'http://localhost:3000/graphql' });
networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    req.options.headers['authorization'] = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    next();
  }
}]);
const client = new ApolloClient({
  networkInterface,
});

export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    ExpensesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HomeModule,
    GroupModule,
    AppRoutingModule,
    ApolloModule.forRoot(provideClient)
  ],
  providers: [
    AuthService,
    AuthGuard,
    ErrorHandlerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
