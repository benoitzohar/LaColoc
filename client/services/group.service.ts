import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {ErrorHandlerService} from "./error-handler.helper";
import {Group} from "../models/group";

@Injectable()
export class GroupService {
  private groupBaseUrl = 'http://localhost:3000/api/groups';

  constructor(private http: Http, private errorHandler: ErrorHandlerService) {
  }

  getAll() {
    return this.http.get(this.groupBaseUrl, this.jwt())
      .map((response: Response) => response.json())
      .catch(this.errorHandler.handleError);
  }

  getById(id: number) {
    return this.http.get(this.groupBaseUrl + '/' + id, this.jwt())
      .map((response: Response) => response.json())
      .catch(this.errorHandler.handleError);
  }

  create(group: Group) {
    return this.http.post(this.groupBaseUrl, group, this.jwt())
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
