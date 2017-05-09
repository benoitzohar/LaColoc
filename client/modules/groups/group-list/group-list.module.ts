import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {GroupListComponent} from './group-list.component';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GroupService} from "../../../services/group.service";

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [
    GroupListComponent
  ],
  exports: [GroupListComponent],
  providers: [GroupService]
})
export class GroupListModule {
}

