import { Component, ViewChild, AfterViewInit, ElementRef, OnInit, HostListener, Inject, ChangeDetectorRef, } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Attribute, AttributeGeneral, AttributeParmas } from 'src/app/core/model/attribute';
import { ApiResponse } from 'src/app/core/model/user-login';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/core/model/user';
import { CommonService } from 'src/app/core/services/common.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-equipment-list',
  templateUrl: './equipment-list.component.html',
  styleUrls: ['./equipment-list.component.scss'],
})
export class EquipmentListComponent implements AfterViewInit, OnInit {
  params: AttributeParmas = new AttributeParmas();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  userData: User;

  displayedColumns: string[] = [
    'name',
    'id',
    'Category',
    'Manufacturer',
    'Status',
    'Action',
  ];
  dataSource: MatTableDataSource<Attribute>;
  dataError = '';
  allData: any = [];
  pageArray = [];
  pageData;
  updateAttributeRecord: any;


  constructor(private attributeService: AttributeService, public dialog: MatDialog, private commonService: CommonService,
    private toastService: ToastService,
    public router: Router, private ref: ChangeDetectorRef) {
    this.userData = JSON.parse(atob(localStorage.getItem(environment.dataKey))).data
    this.params.page = 0;
    this.params.size = 5;
    this.params.name = '';
    this.params.orgID = this.userData.orgID;
    this.params.plantID = this.userData.plantID;
    this.allData = [];
    this.pageArray = [];
    this.dataSource = new MatTableDataSource(this.allData);
    this.getData(this.params);
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(500),
        distinctUntilChanged(),
        tap((text) => {
          this.params.name = this.input.nativeElement.value;
          this.params.page = 0;
          this.params.size = 15;
          this.params.orgID = this.userData.orgID;
          this.params.plantID = this.userData.plantID;
          this.allData = [];
          this.pageArray = [];
          this.attributeService.pageArraylocal = [];
          this.attributeService.attributeList.next(this.allData);
          this.dataSource = new MatTableDataSource(this.allData);
          this.getData(this.params);
        }
        )
      ).subscribe();
    window.addEventListener('scroll', this.onTableScroll, true);
  }

  ngOnInit(): void {
    // this.params.page = 0;
    // this.params.size = 8;
    // this.params.name = '';
    // this.allData = [];
    // this.pageArray = [];
    // this.dataSource = new MatTableDataSource(this.allData);
    // this.getData(this.params);
  }

  getData(params) {
    this.attributeService.getAllAttruibute(params, this.attributeService.pageArraylocal).subscribe((res: ApiResponse) => {
      if (res && res.status) {
        this.dataError = '';
        this.params.page = params.page;
        this.pageData = res.data;
        this.attributeService.pageArraylocal.push(params.page);
        this.allData = this.allData.concat(res.data.content);
        console.log(this.allData,"this.allData");
        
        this.attributeService.attributeList.next(this.allData);
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.sort = this.sort;

      } else if (res) {
        let updatearray = this.commonService.checkUpdateDataWithAttributeList(res, this.attributeService.attributeData.value, 'equipment');
        this.allData = updatearray;
        this.dataSource = new MatTableDataSource(this.allData);
        this.dataSource.sort = this.sort;

      }
    }, err => {
      this.allData = [];
      this.pageArray = [];
      this.attributeService.attributeList.next(this.allData);
      this.dataSource = new MatTableDataSource(this.allData);
      this.dataSource.sort = this.sort;
      this.toastService.errorMsg(err);
      // err.error.message
      // if (!!err.message['message'])
      //   this.toastService.error(err.message['message']);
      // else
      //   this.toastService.error(err.error.message);

      // this.dataError = err.error.message[0];
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: { name: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if(result) { this.router.navigate(['equipment/add', result]); }
    });
  }

  attributeBind(data) {
    console.log(data,"data");
    
    this.attributeService.attributeData.next(data);
  }

  onTableScroll = (e) => {
    const tableViewHeight = e.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 50;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit && this.router.url == "/equipment" && this.pageData && !this.pageData.last && !this.pageArray.includes(this.params.page + 1)) {
      let param = new AttributeParmas();
      param.orgID = this.userData.orgID;
      param.plantID = this.userData.plantID;
      param.page = this.params.page + 1;
      param.size = this.params.size;
      param.name = this.params.name;
      param.orgID = this.userData.orgID;
      param.plantID = this.userData.plantID;
      this.pageArray.push(param.page);
      this.getData(param);
    }
  }

  activate(data: Attribute, index) {
    // // if(data.general) {
    //   data.general['status'] = !data.general['status'] || true;
    // // } else {
    // //   data.general = new AttributeGeneral();
    // //   data.general.status = true;
    // // }
    // debugger;
    // this.attributeService.saveAttruibuteById(data.id, data.general).subscribe(res => {
    //   debugger;
    // }, err => {})

    // debugger;
    // // data.general.status =
  }

  check(e, data: Attribute) {
    if (data.general && data.general !== null) {
      data.general.status = e.checked ? 'ACTIVE' : 'INACTIVE';
    } else {
      data.general = new AttributeGeneral();
      data.general.status = e.checked;
    }
    this.attributeService.saveAttruibuteById(data.id, { general: data.general }).subscribe(res => {
      this.allData.forEach(el => { if (el.id == data.id) { el = res['data'] } });

    }, err => { this.toastService.errorMsg(err); })
  }
}


@Component({
  selector: 'app-dialog',
  styleUrls: ['./equipment-list.component.scss'],
  template: `<div class="d-flex justify-content-between align-items-start"><h1 mat-dialog-title>Equipment Template Name</h1><div class="close" (click)="onNoClick()" style="cursor: pointer; padding-top: 3px"><span class="material-icons"> close </span></div></div>
  <form  [formGroup]="addEquipmentNameForm">
  <div mat-dialog-content style="overflow:hidden;">
    <div class="Equipment-form wquipment-popup w-100">
      <mat-form-field [floatLabel]="'never'" appearance="none" class="example-full-width w-100 addAssetsModelName"  [ngClass]="{'input-error':isSubmitted && addEquipmentNameForm.controls.name.invalid}"  >
        <input type="text" name="name" formControlName="name" [(ngModel)]="data.name"  [autocomplete]="'disabled'" matInput placeholder="Enter Template Name" required>
      </mat-form-field>
      <mat-error *ngIf="isExists && data.name == existingName">Name already exists.</mat-error>
    </div>
  </div>
  <div mat-dialog-actions class="d-flex justify-content-end">
    <button mat-button (click)="onOkClick();"  cdkFocusInitial class="add-btn add-btn2">Ok</button>
  </div>
  </form>`
})
export class DialogComponent implements OnInit {
  isExists = false;
  existingName = '';
  userData: User;
  addEquipmentNameForm: FormGroup;
  isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private attributeService: AttributeService,
    private commonService: CommonService,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.addEquipmentNameForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    })

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick() {
    debugger
    this.isSubmitted = true;
    if (this.addEquipmentNameForm.invalid) {
      for (const i in this.addEquipmentNameForm.controls) {
        this.addEquipmentNameForm.controls[i].markAsDirty();
        this.addEquipmentNameForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    if (this.data.name.trim() == null || this.data.name.trim() == "") {
      this.toastService.errorMsg("Please Enter Template Name"); return false;
    }

    this.userData = this.commonService.getTokenData();
    let data = new Attribute();
    data.general.status = 'ACTIVE';
    data.name = this.data.name;
    data.orgID = this.userData.orgID;
    data.plantID = this.userData.plantID;
    data.user = this.userData.name;
    data.userID = this.userData.userID;
    this.isExists = false;
    this.existingName = '';
    this.attributeService.createAttruibute(data).subscribe(res => {
      if (res && res['status'] != 'CONFLICT') {
        this.attributeService.attributeData.next(res['data']);
        this.attributeService.attributeList.value.push(res['data']);
        this.attributeService.attributeList.next(this.attributeService.attributeList.value);
        this.dialogRef.close();
        this.router.navigate(['equipment/edit', res['data'].id]);
      } else {
        this.attributeService.attributeData.next(new Attribute());
      }
    }, err => {
      if (err['error']['status'] == 'CONFLICT') {
        this.isExists = true;
        this.existingName = data.name;
        this.attributeService.attributeData.next(new Attribute());
        this.toastService.errorMsg(err);
      }
    })
  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.dialogRef.close();
  }

}
