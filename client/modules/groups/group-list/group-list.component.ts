import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {GroupService} from "../../../services/group.service";
import {Group} from "../../../models/group";
import {RouterModule, Router} from "@angular/router";

@Component({
  moduleId: module.id,
  selector: 'group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {

  model: any = {};
  loading: boolean = false;
  groups: Array<Group> = [];

  constructor(private groupService: GroupService, public router: Router) {

  }

  ngOnInit(): void {
    this.fetchGroups();
  }

  createGroup(): void {
    this.router.navigate(['create-group']);
  }

  private fetchGroups() {
    this.loading = true;
    this.groupService.getAll()
      .subscribe(
      data => {
        console.log(data);
        this.groups = data;
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      });
  }
}
