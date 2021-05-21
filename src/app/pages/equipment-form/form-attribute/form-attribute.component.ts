import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Attribute } from 'src/app/core/model/attribute';
import { Assets } from 'src/app/core/model/assets';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { Router } from '@angular/router';
import { AssetsService } from 'src/app/core/services/assets.service';
import { ToastService } from 'src/app/core/services/toast.service';

export interface AttributeTag {
  Name: string;
  Template: string;
}

@Component({
  selector: 'app-form-attribute',
  templateUrl: './form-attribute.component.html',
  styleUrls: ['./form-attribute.component.scss'],
})
export class FormAttributeComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['tag', 'description'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  subs = new Subscription();
  attributeData: Attribute;
  assetsData: Assets;
  isAssets = false;
  isTemp = false;

  constructor(private toastService: ToastService, private attributeService: AttributeService, private assetService: AssetsService, private router: Router, private ref: ChangeDetectorRef) {
    this.isAssets = this.router.url.includes('/assets/');
    this.isTemp = this.router.url.includes('/equipment/');
    if (this.isTemp) {
      this.subs.add(
        this.attributeService.attributeData.subscribe(res => {
          this.attributeData = res;
          if (res && res.attributes && res.attributes.tags) {
            this.dataSource = new MatTableDataSource(res.attributes.tags);
            this.dataSource.sort = this.sort;
          }
        }, err => {
          this.attributeData = new Attribute();
          this.toastService.errorMsg(err);
        })
      )
    } else if (this.isAssets) {
      this.subs.add(
        this.assetService.assetsData.subscribe(res => {
          this.assetsData = res;
          if (res && res.attributes && res.attributes.tags) {
            this.dataSource = new MatTableDataSource(res.attributes.tags);
            this.dataSource.sort = this.sort;
          }
        }, err => {
          this.assetsData = new Assets();
          this.toastService.errorMsg(err);
        })
      )
    }
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }


  ngOnInit(): void {

  }
}
