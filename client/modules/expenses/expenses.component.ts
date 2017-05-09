import { Component } from '@angular/core';

@Component({
  template: `
   <h1>Expenses</h1>
  `
})
export class ExpensesComponent {
  constructor() {
    console.log('Expenses');
  }
}
