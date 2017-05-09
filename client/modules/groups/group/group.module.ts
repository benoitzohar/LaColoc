import {Component, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {GroupComponent} from './group.component';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {GroupService} from "../../../services/group.service";

@NgModule({
  imports: [CommonModule, FormsModule, RouterModule],
  declarations: [
    GroupComponent
  ],
  exports: [GroupComponent],
  providers: [GroupService]
})
export class GroupModule {
}

