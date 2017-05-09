import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router}      from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @Output() onChangeMode = new EventEmitter<string>();
  model: any = {};
  loading: boolean = false;
  error: string = '';

  constructor(public authService: AuthService, public router: Router) {
    this.model.email = 'a@a.a';
    this.model.password = 'a';
  }

  register() {
    this.onChangeMode.emit('register');
  }

  login() {
    this.loading = true;

    this.authService.login(this.model.email, this.model.password)
      .subscribe(
      result => {
        if (result === true) {
          this.router.navigate(['/home']);
        } else {
          this.error = 'Username or password is incorrect';
        }
        this.loading = false;
      },
      error => {
        this.error = <any>error;
        this.loading = false;
      });
  }
}
