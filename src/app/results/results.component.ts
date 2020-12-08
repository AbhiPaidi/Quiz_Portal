import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor() { }

  elements: any = [];
  headElements = ['ID', 'First', 'Last', 'Handle'];

  ngOnInit(): void {

    for (let i = 1; i <= 105; i++) {
      this.elements.push({
        id: i, first: 'User ' + i, last: 'Name ' + i, handle:
          'Handle ' + i
      });
    }
  }

}
