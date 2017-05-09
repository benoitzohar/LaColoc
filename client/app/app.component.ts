import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

const CurrentUser = gql`
  query CurrentUser {
    me(token: "coucou") {
      _id
      name
      email
      groups {
          name
      }
    }
  }
`;

const updateUserName = gql`
  mutation UpdateUserName($id: String!, $name: String!) {
    UpdateUserName(id: $id, name: $name) {
      name
    }
  }
`;


interface QueryResponse {
  me
}

interface User {
    _id,
  name,
  email
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  username: string
  meAsJson: string
  currentUser: User

  constructor(private apollo: Apollo, public authService: AuthService, public router: Router) {

  }

  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({
      query: CurrentUser
    }).subscribe(({data}) => {
      console.log("[debug] data", data)
      this.meAsJson = JSON.stringify(data.me, null, 2);
      this.currentUser = data.me;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  updateName() {
    console.log("[debug] name", name)
    this.apollo.mutate({
      mutation: updateUserName,
      variables: {
        id: this.currentUser._id,
        name: this.username
      }
    }).subscribe(({ data }) => {
      console.log('got data', data);
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }


}
