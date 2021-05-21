import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { Area, AssetHierarchy, Assets, Floc } from 'src/app/core/model/assets';
import { AttributeParmas } from 'src/app/core/model/attribute';
import { AssetsService } from 'src/app/core/services/assets.service';
import { AddNameComponent, AddNameModel } from 'src/app/shared/shared/add-name/add-name.component';
import { Location } from '@angular/common';
import { fromEvent, Subscription } from 'rxjs';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { Attribute } from 'src/app/core/model/attribute';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { ToastService } from 'src/app/core/services/toast.service';
import { User } from 'src/app/core/model/user';
import { AssetsHeaderLayer } from 'src/app/core/enums/roles.enum';
import { CommonService } from 'src/app/core/services/common.service';
import { DialogData } from '../../equipment-template/equipment-list/equipment-list.component';

@Component({
  selector: 'app-assets-form',
  templateUrl: './assets-form.component.html',
  styleUrls: ['./assets-form.component.scss'],
})
export class AssetsFormComponent implements OnInit, AfterViewInit {
  @ViewChild('input') input: ElementRef;
  subs: Subscription = new Subscription();
  sidebarData: AssetHierarchy = new AssetHierarchy();
  assetsData: Assets = new Assets();
  nestedBar: AssetHierarchy;
  params = new AttributeParmas();
  control = new FormControl();
  allTemplates = [];
  userData: User;
  panelOpenState = false;
  isAssestId = false;
  sidebarSelected;
  isAsstesRename = false;
  form: any;
  id: string;

  constructor(private toastService: ToastService, private formBuilder: FormBuilder, private route: ActivatedRoute, private assetsService: AssetsService,
    private router: Router, private dialog: MatDialog, private location: Location, private ref: ChangeDetectorRef,
    private attributeService: AttributeService, private commonService: CommonService) {
    this.form = this.formBuilder.group({
      TemplateName: new FormControl(''),
    });

    this.userData = this.commonService.getTokenData();
    this.params.page = 0;
    this.params.size = 10;
    this.params.orgID = this.userData.orgID;
    this.params.plantID = this.userData.plantID;
    this.getSidebar(this.params);
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.router.url == '/assets') {
        this.isAssestId = false;
      } else {
        this.isAssestId = true;
      }
      if (this.router.url.includes('/assets') && this.id) {
        this.subs.add(
          this.assetsService.getAssetsById(this.id).subscribe((res: any) => {
            if (res && res["data"]) {
              this.assetsData = res['data']
              this.assetsService.assetsData.next(res["data"]);
            } else if (res) {
              this.assetsData = res;
            }
          }, err => {
            this.assetsData = new Assets();
            this.toastService.errorMsg(err);
          })
        )
      }
    })
  }

  getSidebar(params) {
    this.assetsService.getAssetsHierarchy(params).subscribe((res: any) => {
      if (res && res["data"]) {
        this.sidebarData = res["data"];
        this.nestedBar = res["data"][0];
        this.assetsService.assetsHierarchy.next(res["data"][0]);
      } else if (res) {
        this.sidebarData = res;
        this.nestedBar = res;
      }
    }, err => {
      this.toastService.errorMsg(err);
    })
  }


  assetChecked(data, i?: number, j?: number, k?: number) {
    this.assetsService.assetsData.next(data);
    this.assetsService.assetsHierarchyOpend.next({
      i: { index: i, name: this.nestedBar['floc'][i]['name'] },
      j: { index: j, name: this.nestedBar['floc'][i]['area'][j]['name'] },
      k: { index: k, name: this.nestedBar['floc'][i]['area'][j]['area'][k]['assetName'] }
    });
    this.router.navigate(['assets', data.id]);
  }

  ngOnInit(): void {
    this.assetsService.assetsHierarchyOpend.subscribe(res => {
      if (res) {
        this.sidebarSelected = res;
        if (this.router.url == '/assets') {
          setTimeout(() => {
            if (this.nestedBar && this.sidebarSelected && this.sidebarSelected.j.index >= 0) {
              this.getPumps(this.nestedBar['floc'][this.sidebarSelected.i.index]['area'][this.sidebarSelected.j.index], this.sidebarSelected.i.index, this.sidebarSelected.j.index);
            }
          }, 1000);
        }
      }
    })
  }
  submitForm() { }

  ngAfterViewInit() {
    if (this.isAssestId) {
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          filter(Boolean),
          debounceTime(500),
          distinctUntilChanged(),
          tap((text) => {
            this.filterTemplates(this.input.nativeElement.value);
          })).subscribe();
    }
  }

  @ViewChild(MatSort) sort: MatSort;

  getPumps(data, i, j) {
    if (data && data._areaID && !data.area) { // this.nestedBar['floc'][i]['area'][j] && this.nestedBar['floc'][i]['area'][j]['area']
      let param = new AttributeParmas();
      param.page = 0;
      param.size = 10;
      this.assetsService.getAssetsHierarchyByAreaId(data._areaID, param).subscribe(res => {
        if (res && res['data'] && res['data']['content']) {
          this.nestedBar['floc'][i]['area'][j]['area'] = res['data']['content'];
          this.assetsService.assetsHierarchyArea.next(res['data']['content']);
          this.assetsService.assetsHierarchy.next(this.nestedBar);
        } else if (res && res['content']) {
          this.nestedBar['floc'][i]['area'][j]['area'] = res['content'];
        }
      }, err => {
        this.toastService.errorMsg(err);
      })
    }
  }

  addNameDialog(element, type, i?: number, j?: number, isEdit?: boolean, hierarchyString?: string): void {
    let layerWiseHeaderName: any;
    if (type == 'addLayer1')
      layerWiseHeaderName = AssetsHeaderLayer["addLayer1HeaderName"];
    else if (type == 'addLayer2')
      layerWiseHeaderName = AssetsHeaderLayer["addLayer2HeaderName"];
    else if (type == 'addLayer3')
      layerWiseHeaderName = layerWiseHeaderName = AssetsHeaderLayer["addLayer3HeaderName"];

    const dialogData = new AddNameModel(layerWiseHeaderName, '', '', element, type, isEdit, hierarchyString);
    const dialogRef = this.dialog.open(AddNameComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult && dialogResult.checked) {
        let data = this.nestedBar;
        if (type == 'addLayer1') {
          let isCreate = false;
          if (!data) {
            data = new AssetHierarchy();
            this.nestedBar = new AssetHierarchy();
            data.org = this.userData.org;
            data.orgID = this.userData.orgID;
            data.plant = this.userData.plant;
            data.plantID = this.userData.plantID;
            data.user = this.userData.user;
            data.userID = this.userData.userID;
            this.nestedBar.org = this.userData.org;
            this.nestedBar.orgID = this.userData.orgID;
            this.nestedBar.plant = this.userData.plant;
            this.nestedBar.plantID = this.userData.plantID;
            this.nestedBar.user = this.userData.user;
            this.nestedBar.userID = this.userData.userID;
            isCreate = true;
          }
          if (isEdit)
            this.nestedBar.floc[i].name = dialogResult.name;
          else {

            let floc = new Floc();
            floc.name = dialogResult.name;
            floc.status = 'ACTIVE';
            floc.timestamp = (new Date()).toString();
            floc.sequenceNumber = (this.getSequence()).toString();
            floc._flocID = this.createFlocId(floc.sequenceNumber, floc.name);
            floc.area = [];
            if (data && data.floc) { data.floc.push(floc); } else { data['floc'] = [floc]; }
          }

          if (isCreate) {
            this.assetsService.createAssetHierarchyById(data).subscribe(res => {
              this.nestedBar = res['data'];
              this.assetsService.assetsHierarchyArea.next(res['data']['content'])
            }, err => { this.toastService.errorMsg(err); })
          } else {
            this.assetsService.saveAssetHierarchyById(data.id, data).subscribe(res => { this.toastService.savedataMsg(res['message']); }, err => { this.toastService.errorMsg(err); })
          }
        } else if (type == 'addLayer2') {
          if (isEdit) {
            data.floc[i].area[j].name = dialogResult.name;
          }
          else {
            let area: Area = new Area();
            area.sequenceNumber = (this.getAreaSeq(i)).toString();
            area.name = dialogResult.name;
            area._areaID = this.nestedBar.floc[i]._flocID + '-' + this.removeExtraSpaceAndConvertLowercase(area.name) + '-' + area.sequenceNumber;
            area.status = 'ACTIVE';
            if (data.floc[i] && data.floc[i].area) {
              data.floc[i].area.push(area);
            } else {
              data.floc[i]['area'] = [area];
            }
          }
          this.assetsService.saveAssetHierarchyById(data.id, data).subscribe(res => { this.toastService.savedataMsg(res['message']); }, err => { this.toastService.errorMsg(err); })
        } else if (type == 'addLayer3') {

          let temp = new Assets();
          temp.general.status = "ACTIVE";
          temp.assetName = dialogResult.name;
          temp._flocID = this.nestedBar['floc'][i]['_flocID'];
          temp._areaID = this.nestedBar['floc'][i]['area'][j]['_areaID'];
          temp.org = this.nestedBar.org;
          temp.orgID = this.nestedBar.orgID;
          temp.plant = this.nestedBar.plant;
          temp.plantID = this.nestedBar.plantID;
          temp.user = this.userData.user;
          temp.userID = this.userData.userID;
          temp.areaName = this.nestedBar.floc[i].area[j].name;
          temp.flocName = this.nestedBar.floc[i].name;
          this.assetsService.createAsset(temp).subscribe(res => {

            if (this.nestedBar['floc'][i]['area'][j]['area']) {
              this.nestedBar['floc'][i]['area'][j]['area'].push(res['data']);
            } else {
              this.nestedBar['floc'][i]['area'][j]['area'] = [res['data']];
            }
            this.assetsService.assetsData.next(res['data']);
            this.router.navigate(['assets', res['data'].id]);
          },
            err => { this.toastService.errorMsg(err); })
        }
      }
    });
  }
  getSequence() {
    if (this.nestedBar.floc && this.nestedBar.floc.length > 0) {
      return Math.max.apply(Math, this.nestedBar.floc.map(function (item) {
        return +item.sequenceNumber;
      })) + 1;
    } else {
      return 1;
    }
  }
  getAreaSeq(i) {
    if (this.nestedBar.floc[i].area && this.nestedBar.floc[i].area.length > 0) {
      return Math.max.apply(Math, this.nestedBar.floc[i].area.map(function (o) {
        return +o.sequenceNumber;
      })) + 1;
    } else {
      return 1;
    }
  }
  createFlocId(id, floc) {
    return this.nestedBar.orgID + '-' + this.nestedBar.plantID + '-' + this.removeExtraSpaceAndConvertLowercase(floc) + '-' + id;
  }

  removeExtraSpaceAndConvertLowercase(value) {
    let replaceValue = value.split(" ").join("");
    return replaceValue.toLocaleLowerCase();
  }


  ClickTemplates(street: any) {
    const dialogRef = this.dialog.open(ConfirmModelOfAssetsSearchComponent, {
      width: '400px',
      data: { attributeData: street, assetdata: this.assetsData },
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      this.input.nativeElement.value = '';
    });
  }


  filterTemplates(name) {
    let params = {
      size: 9999,
      name: name,
      page: 0,
      orgID: this.userData.orgID,
      plantID: this.userData.plantID
    }
    this.attributeService.getAllAttruibute(params, []).subscribe((res: any) => {
      if (res && res.data && res.data.content) {
        this.allTemplates = [];
        res.data.content.forEach(element => {
          if (element.general.status == 'ACTIVE')
            this.allTemplates.push(element);
        });
      } else if (res) {
        this.allTemplates = res;
      }
    }, err => {
      this.toastService.errorMsg(err);
      this.allTemplates = [];
    })
  }

}


@Component({
  selector: 'app-confirm-model-Of-assets',
  styleUrls: ['./assets-form.component.scss'],
  template: `<div class="d-flex justify-content-between align-items-start">
    <h1 mat-dialog-title>Confirmation Message</h1>
    <div class="close" (click)="onNoClick()" style="cursor: pointer; padding-top: 3px">
    <span class="material-icons"> close </span></div></div>
  <div mat-dialog-content style="overflow:hidden;">
    <div class="Equipment-form wquipment-popup w-100">
      Are you sure to select record?
    </div>
  </div>
  <div mat-dialog-actions class="mat-dialog-actions d-flex justify-content-end">
    <button mat-button (click)="onOkClick();"  cdkFocusInitial class="mat-focus-indicator add-btn add-btn2 mat-button mat-button-base">Ok</button>
    <button mat-button (click)="onNoClick()" class="mat-focus-indicator cancel-btn mat-button mat-button-base">Cancel</button>
  </div>`
})


export class ConfirmModelOfAssetsSearchComponent implements OnInit {
  assetsData: Assets = new Assets();
  subs: Subscription = new Subscription();
  id: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmModelOfAssetsSearchComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private router: Router,
    private assetsService: AssetsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');

      if (this.router.url.includes('/assets') && this.id) {
        this.subs.add(
          this.assetsService.getAssetsById(this.id).subscribe((res: any) => {
            if (res && res["data"]) {
              this.assetsData = res['data']
              this.assetsService.assetsData.next(res["data"]);
            } else if (res) {
              this.assetsData = res;
            }
          }, err => {
            this.assetsData = new Assets();
            this.toastService.errorMsg(err);
          })
        )
      }
    })
  }




  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick() {
    this.assetsData = this.data.assetdata;
    let attributeData = this.data.attributeData;
    this.assetsData.attributes = attributeData.attributes;
    this.assetsData.general = attributeData.general;
    this.assetsData.procedures = attributeData.procedures;
    this.assetsData.loto = attributeData.loto;
    this.assetsData.ppe = attributeData.ppe;
    this.assetsData.templateID = attributeData.id;
    // this.assetsData.name = attributeData.name;
    this.assetsService.saveAssetsById(this.assetsData.id, this.assetsData).subscribe(res => {
      this.assetsService.assetsData.next(res['data']);
      this.dialogRef.close();
    },
      err => {
        this.toastService.errorMsg(err);
      })

  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.dialogRef.close();
  }

}