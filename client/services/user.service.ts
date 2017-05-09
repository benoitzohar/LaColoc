import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {User} from '../models/user';
import {Observable} from "rxjs";
import {ErrorHandlerService} from "./error-handler.helper";

@Injectable()
export class UserService {
  private userBaseUrl = 'http://localhost:3000/api/users';

  constructor(private http: Http, private errorHandler: ErrorHandlerService) {
  }

  /*getAll() {
    return this.http.get(this.userBaseUrl, this.jwt())
      .map((response: Response) => response.json())
      .catch(this.errorHandler.handleError);
  }*/

  /*getById(id: number) {
    return this.http.get(this.userBaseUrl + '/' + id, this.jwt())
      .map((response: Response) => response.json())
      .catch(this.errorHandler.handleError);
  }*/

  create(user: User) {
    return this.http.post(this.userBaseUrl, user, this.jwt())
      .map((response: Response) => response.json())
      .catch(this.errorHandler.handleError);
  }


  /*update(user: User) {
   return this.http.put(this.userBaseUrl + '/' + user.id, user, this.jwt()).map((response: Response) => response.json());
   }

   delete(id: number) {
   return this.http.delete(this.userBaseUrl + '/' + id, this.jwt()).map((response: Response) => response.json());
   }*/

  private jwt() {
    let token = localStorage.getItem('token');
    if (token) {
      let headers = new Headers({ 'Authorization': token });
      return new RequestOptions({ headers: headers });
    }
  }
}
