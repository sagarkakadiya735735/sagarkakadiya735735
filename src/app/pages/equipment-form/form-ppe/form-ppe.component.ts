import { PPEMandatory } from './../../../core/enums/roles.enum';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Attribute, Equipment } from 'src/app/core/model/attribute';
import { AttributeService } from 'src/app/core/services/attribute.service';
import {
  ConfirmDialogModel,
  DeleteConfirmComponent,
} from 'src/app/shared/shared/delete-confirm/delete-confirm.component';
import { Router } from '@angular/router';
import { AssetsService } from 'src/app/core/services/assets.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-form-ppe',
  templateUrl: './form-ppe.component.html',
  styleUrls: ['./form-ppe.component.scss'],
})
export class FormPpeComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [
    'sequenceNumber',
    'protectiveEquipment',
    'mandatory',
    'action',
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  subs = new Subscription();
  attributeData: Attribute;
  assetsData: Attribute;
  PPEMandatories = PPEMandatory;
  isAssets = false;
  isTemp = false;
  elistMatTableDataSource = new MatTableDataSource<Element>();
  txtprotectiveEquipment;

  constructor(
    private toastService: ToastService,
    private attributeService: AttributeService,
    public dialog: MatDialog,
    private assetService: AssetsService,
    private router: Router
  ) {
    this.isAssets = this.router.url.includes('/assets/');
    this.isTemp = this.router.url.includes('/equipment/');
    if (this.isTemp) {
      this.subs.add(
        this.attributeService.attributeData.subscribe(
          (res) => {
            this.attributeData = res;
            if (res && res.ppe && res.ppe.equipment) {
              this.dataSource = new MatTableDataSource(res.ppe.equipment);
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
            if (res && res.ppe && res.ppe.equipment) {
              this.dataSource = new MatTableDataSource(res.ppe.equipment);
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
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void { }
  add() {
    let id = 1;
    if (this.isTemp && this.isValidAttributePPE()) {
      if (
        this.attributeData &&
        this.attributeData.ppe &&
        this.attributeData.ppe.equipment &&
        this.attributeData.ppe.equipment.length > 0
      ) {
        id =
          Math.max.apply(
            Math,
            this.attributeData.ppe.equipment.map(function (o) {
              return +o.sequenceNumber;
            })
          ) + 1;
      } else {
        this.attributeData['ppe'] = { equipment: [] };
      }
    } else if (this.isAssets && this.isValidAssetsPPE()) {
      if (
        this.assetsData &&
        this.assetsData.ppe &&
        this.assetsData.ppe.equipment &&
        this.assetsData.ppe.equipment.length > 0
      ) {
        id =
          Math.max.apply(
            Math,
            this.assetsData.ppe.equipment.map(function (o) {
              return +o.sequenceNumber;
            })
          ) + 1;
      } else {
        this.assetsData['ppe'] = { equipment: [] };
      }
    } else {
      return;
    }
    let equipment = new Equipment();
    equipment.sequenceNumber = id;
    equipment['edit'] = true;
    if (this.isTemp) {
      this.attributeData.ppe.equipment.push(equipment);
      this.dataSource = new MatTableDataSource(
        this.attributeData.ppe.equipment
      );
    } else if (this.isAssets) {
      this.assetsData.ppe.equipment.push(equipment);
      this.dataSource = new MatTableDataSource(this.assetsData.ppe.equipment);
    }

  }

  submit(i) {
    if (this.isTemp && this.isValidAttributePPE()) {
      let taskToBeSave = this.attributeData.ppe.equipment[i];
      let duplicateList = this.attributeData.ppe.equipment.filter((el, index) => {
        if (el['protectiveEquipment'] == taskToBeSave['protectiveEquipment'] && i != index) {
          return el;
        }
      })
      if (duplicateList && duplicateList.length > 0) {
        this.toastService.infoMsg('Check task is already exist.', '');
        return;
      }

      this.attributeService
        .saveAttruibuteById(this.attributeData.id, {
          ppe: this.attributeData.ppe,
        })
        .subscribe(
          (res) => {
            this.attributeService.attributeData.next(res['data']);
            this.attributeService.updateAllAttributeData(res['data']);
            this.toastService.savedataMsg(res['message']);
          },
          (err) => {
            this.toastService.errorMsg(err);;
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
        .saveAssetsById(this.assetsData.id, { ppe: this.assetsData.ppe })
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

  deleteCheckPPERecord(value) {
    let checkDirectDeleteOrNot: any;
    if (this.isTemp) {
      this.attributeData.ppe.equipment.forEach((el, i) => {
        if (!!value.sequenceNumber)
          checkDirectDeleteOrNot = value.sequenceNumber;
        else checkDirectDeleteOrNot = value.id.sequenceNumber;
        if (el.sequenceNumber == checkDirectDeleteOrNot) {
          this.attributeData.ppe.equipment.splice(i, 1);
          this.attributeService
            .saveAttruibuteById(this.attributeData.id, {
              ppe: this.attributeData.ppe,
            })
            .subscribe((res) => {
              this.attributeService.attributeData.next(res['data']);
              this.attributeService.updateAllAttributeData(res['data']);
              this.toastService.savedataMsg('PPE Deleted Successfully');
            });
        }
      });
    } else if (this.isAssets) {
      this.assetsData.ppe.equipment.forEach((el, i) => {
        if (!!value.sequenceNumber)
          checkDirectDeleteOrNot = value.sequenceNumber;
        else checkDirectDeleteOrNot = value.id.sequenceNumber;
        if (el.sequenceNumber == checkDirectDeleteOrNot) {
          this.assetsData.ppe.equipment.splice(i, 1);
          this.assetService
            .saveAssetsById(this.assetsData.id, {
              ppe: this.assetsData.ppe,
            })
            .subscribe((res) => {
              this.assetService.assetsData.next(res['data']);
              this.assetService.updateAllAssetsData(res['data']);
              this.toastService.savedataMsg('PPE Deleted Successfully');
            });
        }
      });
    }
  }

  confirmDialog(element): void {
    if (!element.protectiveEquipment && !element.mandatory) {
      this.deleteCheckPPERecord(element);
    } else {
      const message = `Do you wanna delete this?`;
      const dialogData = new ConfirmDialogModel(
        element.protectiveEquipment,
        message,
        element
      );

      const dialogRef = this.dialog.open(DeleteConfirmComponent, {
        maxWidth: '600px',
        data: dialogData,
      });

      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult.checked) {
          this.deleteCheckPPERecord(dialogResult);
        }
      });
    }
  }

  closeAllEdit(i) {
    if (this.isTemp) {
      this.attributeData.ppe.equipment.forEach((e, j) => {
        e['edit'] = i == j ? true : false;
      });
    } else if (this.isAssets) {
      this.assetsData.ppe.equipment.forEach((e, j) => {
        e['edit'] = i == j ? true : false;
      });
    }
  }
  onEditClick(data, index) {
    if (data['edit']) {
      this.submit(index);

      // this.closeAllEdit(null);
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
    if (this.attributeData.ppe && this.attributeData.ppe.equipment) {
      let x = this.attributeData.ppe.equipment.filter((ele) => {
        if (ele.protectiveEquipment == null || ele.protectiveEquipment == '') {
          return ele;
        }
      });
      if (x && x.length > 0)
        this.toastService.infoMsg('Protective Equipment Is Required', '');
      return x && x.length > 0 ? false : true;
    }
    return true;
  }
  isValidAssetsPPE() {
    if (this.assetsData.ppe && this.assetsData.ppe.equipment) {
      let x = this.assetsData.ppe.equipment.filter((ele) => {
        if (ele.protectiveEquipment == null || ele.protectiveEquipment == '') {
          return ele;
        }
      });
      if (x && x.length > 0)
        this.toastService.infoMsg('Protective Equipment Is Required', '');
      return x && x.length > 0 ? false : true;
    }
    return true;
  }
}
