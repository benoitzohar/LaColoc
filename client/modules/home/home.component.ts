import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  mode: string;

  constructor(public authService: AuthService, public router: Router) {

  }

  ngOnInit() {
    this.mode = 'login';
  }

  onChangeMode(mode: string) {
    this.mode = mode;
  }
}
