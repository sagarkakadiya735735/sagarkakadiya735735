import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  Name: string;
  SOP: string;
  From: string;
  To: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Name: 'Flowserve - Mark3 - Pump',
    SOP: 'Reliability',
    From: '01/01/2005',
    To: '12/31/2023',
  },
];

@Component({
  selector: 'app-sops-permits',
  templateUrl: './sops-permits.component.html',
  styleUrls: ['./sops-permits.component.scss'],
})
export class SopsPermitsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  displayedColumns: string[] = ['Name', 'SOP', 'From', 'To'];

  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
