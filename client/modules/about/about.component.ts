import {Component} from '@angular/core';

@Component({
  template: `
    <h1>About</h1>
<!--
    <form #form="ngForm" (ngSubmit)="onSubmit(form.value, form)" novalidate>
      <div>
        <label>
          <input
            #inputEmail="ngModel"
            name="inputEmail"
            [(ngModel)]="email"
            acIsEmail
          >
        </label>
      </div>

      <div *ngIf="form.submitted && inputEmail?.errors?.isEmail" style="background-color: red">
        Please use a valid email address
      </div>

      <button>Submit</button>

    </form>-->
  `
})
export class AboutComponent {
  localState = {
    email: ''
  };

  constructor() {
  }

  onSubmit(value, form) {
    /*if (form.valid) {
      console.log('form value', value);

      let newState = Object.assign({}, value);
      this.appStore.setState(newState);

      return form.reset(); // doesn't work right now
    }

    console.log('form invalid');*/

  }
}
