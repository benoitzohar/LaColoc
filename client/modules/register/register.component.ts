import {Component, Output, EventEmitter} from '@angular/core';
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user";

@Component({
  moduleId: module.id,
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  model: any = {};
  loading: boolean = false;
  @Output() onChangeMode = new EventEmitter<string>();

  constructor(public authService: AuthService,
    private userService: UserService) {
  }

  login() {
    this.onChangeMode.emit('login');
  }

  register() {
    this.loading = true;
    this.userService.create(this.model)
      .subscribe(
      data => {
        console.log(data);
        this.onChangeMode.emit('login');
      },
      error => {
        console.log(error);
        this.loading = false;
      });
  }
}
