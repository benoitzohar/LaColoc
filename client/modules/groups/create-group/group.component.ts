import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Router}      from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent {
  model: any = {};

  constructor(public router: Router) {

  }
}
