import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  Name: string;
  Template: string;
  Category: string;
  Manufacturer: string;
  Status: string;
  Action: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Name: 'Office Pump',
    Template: 'AHDJ7812A',
    Category: 'Pump',
    Manufacturer: 'FlowServe',
    Status: 'ACTIVE',
    Action: '',
  },
  {
    Name: 'Fan Cooler',
    Template: 'AHDJ939N',
    Category: 'Fan',
    Manufacturer: 'FlowServe',
    Status: 'INACTIVE',
    Action: '',
  },
  {
    Name: 'Office Pump',
    Template: 'AHDJ7812A',
    Category: 'Pump',
    Manufacturer: 'FlowServe',
    Status: 'ACTIVE',
    Action: '',
  },
];

@Component({
  selector: 'app-assets-list',
  templateUrl: './assets-list.component.html',
  styleUrls: ['./assets-list.component.scss'],
})
export class AssetsListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'Name',
    'Template',
    'Category',
    'Manufacturer',
    'Status',
    'Action',
  ];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
