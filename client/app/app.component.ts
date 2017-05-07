import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const CurrentUser = gql`
  query CurrentUser {
    me(token: "coucou") {
      name
      email
      groups {
          name
      }
    }
  }
`;

interface QueryResponse {
  me
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string
  meAsJson: string

  constructor(private apollo: Apollo) {
    this.title = 'app works!';

  }

  ngOnInit() {
    this.apollo.watchQuery<QueryResponse>({
      query: CurrentUser
    }).subscribe(({data}) => {
      console.log("[debug] data", data)
      this.meAsJson = JSON.stringify(data.me, null, 2);
    });
  }


}
