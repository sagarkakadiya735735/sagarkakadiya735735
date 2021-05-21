import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Attribute } from 'src/app/core/model/attribute';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { Router } from '@angular/router';
import { AssetsService } from 'src/app/core/services/assets.service';
import { Assets } from 'src/app/core/model/assets';
import { ToastService } from 'src/app/core/services/toast.service';

export interface ProcedureSOP {
  id: string;
  details: number;
  effort: string;
  category: string;
}

@Component({
  selector: 'app-form-procedure',
  templateUrl: './form-procedure.component.html',
  styleUrls: ['./form-procedure.component.scss'],
})
export class FormProcedureComponent implements AfterViewInit, OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['details', 'id', 'effort', 'category'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  subs = new Subscription();
  attributeData: Attribute;
  assetsData: Assets;
  isAssets = false;
  isTemp = false;

  constructor(private toastService: ToastService,
    private attributeService: AttributeService,
    private assetService: AssetsService,
    private router: Router) {
    this.isAssets = this.router.url.includes('/assets/');
    this.isTemp = this.router.url.includes('/equipment/');
    if (this.isTemp) {
      this.subs.add(
        this.attributeService.attributeData.subscribe(res => {
          this.attributeData = res;
          if (res && res.procedures && res.procedures.sop) {
            this.dataSource = new MatTableDataSource(res.procedures.sop);
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
          if (res && res.procedures && res.procedures.sop) {
            this.dataSource = new MatTableDataSource(res.procedures.sop);
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
  ngOnInit(): void { }
}
