import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  Name: string;
  Template: number;
  Category: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Name: 'Dallas',
    Template: 123,
    Category: 'Dallas-South-pump-FlowServe',
  },
  {
    Name: 'Dallas',
    Template: 234,
    Category: 'Dallas-North-pump-FlowServe',
  },
  {
    Name: 'Houston',
    Template: 456,
    Category: 'HoustonPlant-pump-abc',
  },
];

@Component({
  selector: 'app-form-reports',
  templateUrl: './form-reports.component.html',
  styleUrls: ['./form-reports.component.scss'],
})
export class FormReportsComponent implements AfterViewInit {
  displayedColumns: string[] = ['Name', 'Template', 'Category'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
