import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx';
import {Http, Response} from "@angular/http";
import {ErrorHandlerService} from "./error-handler.helper";

@Injectable()
export class AuthService {
  private authUrl = 'http://localhost:3000/api/users/login';
  public token: string;

  constructor(private http: Http, private errorHandler: ErrorHandlerService) {
    this.token = localStorage.getItem('token');
  }

  logout(): void {
    this.token = undefined;
    localStorage.removeItem('token');
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http.post(this.authUrl, { email: email, password: password })
      .map((response: Response) => {
        let token = response.json() && response.json().token;
        if (token) {
          this.token = token;
          localStorage.setItem('token', token);
          return true;
        } else {
          return false;
        }
      }).catch(this.errorHandler.handleError);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }
}
