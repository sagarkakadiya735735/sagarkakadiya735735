import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { Attribute, Task } from 'src/app/core/model/attribute';
import { AttributeService } from 'src/app/core/services/attribute.service';
import {
  ConfirmDialogModel,
  DeleteConfirmComponent,
} from 'src/app/shared/shared/delete-confirm/delete-confirm.component';
import { AssetsService } from 'src/app/core/services/assets.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { LotoType } from 'src/app/core/enums/roles.enum';
import { ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-form-loto',
  templateUrl: './form-loto.component.html',
  styleUrls: ['./form-loto.component.scss'],
})
export class FormLotoComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'sequenceNumber',
    'checkTask',
    'type',
    'action',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  subs = new Subscription();
  attributeData: Attribute;
  assetsData: Attribute;
  lotoTypeFormontrol = new FormControl();
  lotoType: string[] = LotoType;
  filteredOptions: Observable<string[]>;
  isAssets = false;
  isTemp = false;
  txtCheck;

  constructor(
    private toastService: ToastService,
    private attributeService: AttributeService,
    public dialog: MatDialog,
    private router: Router,
    private assetService: AssetsService
  ) {
    this.isAssets = this.router.url.includes('/assets/');
    this.isTemp = this.router.url.includes('/equipment/');
    if (this.isTemp) {
      this.subs.add(
        this.attributeService.attributeData.subscribe(
          (res) => {
            this.attributeData = res;
            if (res && res.loto && res.loto.tasks) {
              this.dataSource = new MatTableDataSource(res.loto.tasks);
              this.dataSource.sort = this.sort;
            }
          },
          (err) => {
            this.toastService.errorMsg(err);
            this.attributeData = new Attribute();
          }
        )
      );
    } else if (this.isAssets) {
      this.subs.add(
        this.assetService.assetsData.subscribe(
          (res) => {
            this.assetsData = res;
            if (res && res.loto && res.loto.tasks) {
              this.dataSource = new MatTableDataSource(res.loto.tasks);
              this.dataSource.sort = this.sort;
            }
          },
          (err) => {
            this.assetsData = new Attribute();
            this.toastService.errorMsg(err);
          }
        )
      );
    }

    // this.filteredLotoType = this.lotoTypeFormontrol.valueChanges
    //   .pipe(
    //     startWith(''),
    //     map(value => this.filterLotoType(value))
    //   );

    this.filteredOptions = this.lotoTypeFormontrol.valueChanges.pipe(
      startWith(''),
      map(value => this.filterLotoType(value))
    );
  }




  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void { }
  add() {
    let id = 1;
    if (this.isTemp && this.isValidAttributePPE()) {
      if (this.attributeData && this.attributeData.loto && this.attributeData.loto.tasks && this.attributeData.loto.tasks.length > 0) {
        id = Math.max.apply(Math, this.attributeData.loto.tasks.map(function (o) {
          return o.sequenceNumber;
        })
        ) + 1;
      } else {
        this.attributeData['loto'] = { tasks: [] };
      }
    } else if (this.isAssets && this.isValidAssetsPPE()) {
      if (
        this.assetsData &&
        this.assetsData.loto &&
        this.assetsData.loto.tasks &&
        this.assetsData.loto.tasks.length > 0
      ) {
        id =
          Math.max.apply(
            Math,
            this.assetsData.loto.tasks.map(function (o) {
              return o.sequenceNumber;
            })
          ) + 1;
      } else {
        this.assetsData['loto'] = { tasks: [] };
      }
    } else {
      return;
    }

    let task = new Task();
    task.sequenceNumber = id;
    task['edit'] = true;

    if (this.isTemp) {
      this.attributeData.loto.tasks.push(task);
      this.dataSource = new MatTableDataSource(this.attributeData.loto.tasks);
    } else if (this.isAssets) {
      this.assetsData.loto.tasks.push(task);
      this.dataSource = new MatTableDataSource(this.assetsData.loto.tasks);
    }
  }

  submit(i) {
    if (this.isTemp && this.isValidAttributePPE()) {
      let taskToBeSave = this.attributeData.loto.tasks[i];
      let duplicateList = this.attributeData.loto.tasks.filter((el, index) => {
        if (el['checkTask'] == taskToBeSave['checkTask'] && i != index) {
          return el;
        }
      })
      if (duplicateList && duplicateList.length > 0) {
        this.toastService.infoMsg('Check task is already exist.', '');
        return;
      }
      this.attributeService
        .saveAttruibuteById(this.attributeData.id, {
          loto: this.attributeData.loto,
        })
        .subscribe(
          (res) => {
            this.attributeService.attributeData.next(res['data']);
            this.attributeService.updateAllAttributeData(res['data']);
            this.toastService.savedataMsg(res['message']);
          },
          (err) => {
            this.toastService.errorMsg(err);
          }
        );
    } else if (this.isAssets && this.isValidAssetsPPE()) {
      let taskToBeSave = this.assetsData.loto.tasks[i];
      let duplicateList = this.assetsData.loto.tasks.filter((el, index) => {
        if (el['checkTask'] == taskToBeSave['checkTask'] && i != index) {
          return el;
        }
      })
      if (duplicateList && duplicateList.length > 0) {
        this.toastService.infoMsg('Check task is already exist.', '');
        return;
      }

      this.assetService
        .saveAssetsById(this.assetsData.id, { loto: this.assetsData.loto })
        .subscribe(
          (res) => {
            this.assetService.assetsData.next(res['data']);
            this.assetService.updateAllAssetsData(res['data']);
            this.toastService.savedataMsg(res['message']);
          },
          (err) => {
            this.toastService.errorMsg(err);
          }
        );
    }
  }

  deleteCheckLotoRecord(value) {
    let checkDirectDeleteOrNot: any;
    if (this.isTemp) {
      this.attributeData.loto.tasks.forEach((el, i) => {
        if (!!value.sequenceNumber)
          checkDirectDeleteOrNot = value.sequenceNumber;
        else checkDirectDeleteOrNot = value.id.sequenceNumber;
        if (el.sequenceNumber == checkDirectDeleteOrNot) {
          this.attributeData.loto.tasks.splice(i, 1);
          this.attributeService
            .saveAttruibuteById(this.attributeData.id, {
              loto: this.attributeData.loto,
            })
            .subscribe((res) => {
              this.attributeService.attributeData.next(res['data']);
              this.attributeService.updateAllAttributeData(res['data']);
              this.toastService.savedataMsg('Loto Deleted Successfully');
            });
        }
      });
    } else if (this.isAssets) {
      this.assetsData.loto.tasks.forEach((el, i) => {
        if (!!value.sequenceNumber)
          checkDirectDeleteOrNot = value.sequenceNumber;
        else checkDirectDeleteOrNot = value.id.sequenceNumber;
        if (el.sequenceNumber == checkDirectDeleteOrNot) {
          this.assetsData.loto.tasks.splice(i, 1);
          this.assetService
            .saveAssetsById(this.assetsData.id, { loto: this.assetsData.loto })
            .subscribe((res) => {
              this.assetService.assetsData.next(res['data']);
              this.assetService.updateAllAssetsData(res['data']);
              this.toastService.savedataMsg('Loto Deleted Successfully');
            });
        }
      });
    }
  }

  confirmDialog(element): void {
    if (!element.checkTask && !element.type) {
      this.deleteCheckLotoRecord(element);
    } else {
      const message = `Do you wanna delete this?`;

      const dialogData = new ConfirmDialogModel(
        element.checkTask,
        message,
        element
      );

      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        maxWidth: '600px',
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult.checked) {
          this.deleteCheckLotoRecord(dialogResult);
        }
      });
    }
  }
  closeAllEdit(i) {
    if (this.isTemp) {
      this.attributeData.loto.tasks.forEach((e, j) => {
        e['edit'] = i == j ? true : false;
      });
    } else if (this.isAssets) {
      this.assetsData.loto.tasks.forEach((e, j) => {
        e['edit'] = i == j ? true : false;
      });
    }
  }
  onEditClick(data, index) {
    if (data['edit']) {
      this.submit(index);
    } else {
      if (
        (this.isTemp && !this.isValidAttributePPE()) ||
        (this.isAssets && !this.isValidAssetsPPE())
      ) {
        return;
      }
      this.closeAllEdit(index);
    }
  }
  isValidAttributePPE() {
    if (this.attributeData.loto && this.attributeData.loto.tasks) {
      let x = this.attributeData.loto.tasks.filter((ele, index) => {
        if (ele.checkTask == null || ele.checkTask == '') {
          return ele;
        }
      });
      if (x && x.length > 0)
        this.toastService.infoMsg('Check Task Is Required', '');
      return x && x.length > 0 ? false : true;
    }
    return true;
  }
  isValidAssetsPPE() {
    if (this.assetsData.loto && this.assetsData.loto.tasks) {
      let x = this.assetsData.loto.tasks.filter((ele) => {
        if (ele.checkTask == null || ele.checkTask == '') {
          return ele;
        }
      });
      if (x && x.length > 0)
        this.toastService.infoMsg('Check Task Is Required', '');
      return x && x.length > 0 ? false : true;
    }
    return true;
  }

  private filterLotoType(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.lotoType.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

}
