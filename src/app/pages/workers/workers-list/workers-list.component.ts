import { ApiResponse } from 'src/app/core/model/user-login';
import { Subscription, fromEvent } from 'rxjs';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, ViewChild, NgModule } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Details, Worker, workersList } from 'src/app/core/model/worker';
import { WorkerService } from 'src/app/core/services/worker.service';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'src/app/core/services/toast.service';
import { AttributeGeneral } from 'src/app/core/model/attribute';
import { CommonService } from 'src/app/core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-workers-list',
  templateUrl: './workers-list.component.html',
  styleUrls: ['./workers-list.component.scss'],
})
export class WorkersListComponent implements OnInit, AfterViewInit {

  sub: Subscription = new Subscription();
  params: workersList = new workersList();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  data: Worker;

  displayedColumns: string[] = ['Name', 'WorkerID', 'Email', 'Phone', 'Status', 'Action'];
  dataSource: MatTableDataSource<Details>;

  dataError = '';
  workerListData: any = [];
  pageArray = [];
  pageData;


  constructor(private ref: ChangeDetectorRef,
    private commonService: CommonService,
    private toastService: ToastService,
    public dialog: MatDialog,
    private workerService: WorkerService,
    private router: Router) {
    this.params.page = 0;
    this.params.size = 15;
    this.params.name = '';
    this.pageArray = [];
    this.workerListData = [];
    this.dataSource = new MatTableDataSource(this.workerListData);
    // this.workerService.pageArraylocal = [];
    this.getWorkerListData(this.params);

  }

  ngOnInit(): void { }
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
          this.workerListData = [];
          this.pageArray = [];
          this.workerService.pageArraylocal = [];
          this.getWorkerListData(this.params);
        }
        )
      ).subscribe();
    window.addEventListener('scroll', this.onTableScroll, true);
  }

  onTableScroll = (e) => {
    const tableViewHeight = e.target.offsetHeight // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled
    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 50;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit && this.router.url == "/workers" && this.pageData && !this.pageData.last && !this.pageArray.includes(this.params.page + 1)) {
      let param = new workersList();
      param.name = '';
      param.page = this.params.page + 1;
      param.size = this.params.size;
      this.pageArray.push(param.page);
      this.getWorkerListData(param);
    }
  }

  getWorkerListData(params) {
    this.sub.add(this.workerService.getAllWorkersData(params, this.workerService.pageArraylocal).subscribe((res: ApiResponse) => {
      if (res && res.status) {
        this.dataError = '';
        this.params.page = params.page;
        this.pageData = res.data;
        this.workerService.pageArraylocal.push(params.page);
        this.workerListData = this.workerListData.concat(res.data.content);
        this.workerService.workerList.next(this.workerListData);
        this.dataSource = new MatTableDataSource(this.workerListData);
        this.dataSource.sort = this.sort;
      }
      else if (res) {
        let updatearray = this.commonService.checkUpdateDataWithAttributeList(res, this.workerService.workerData.value, 'workers');
        this.workerListData = updatearray;
        this.dataSource = new MatTableDataSource(this.workerListData);
        this.dataSource.sort = this.sort;
      }
    }, err => {
      // this.dataError = err.error.message[0];
      this.dataSource = new MatTableDataSource([]);
      this.workerListData = [];
      this.dataSource.sort = this.sort;
      this.toastService.errorMsg(err);
    }));
  }

  addWorker(data) {
    this.workerService.workerData.next(data)
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

  checkWorkerStatus(e, data: Worker, id) {
    if (data.worker && data.worker !== null) {
      data.status = e.checked ? 'ACTIVE' : 'INACTIVE';
      data.worker.status = e.checked ? 'ACTIVE' : 'INACTIVE';
    } else {
      data.worker = new Details();
      data.status = e.checked;
      data.worker.status = e.checked;
    }
    this.workerService.updateWorkerDeatailById(id, data).subscribe(res => {
      this.workerListData.forEach(el => { if (el.id == id) { el = res['data'] } });

    }, err => {
      this.toastService.errorMsg(err);
    })
  }
}


@Component({
  selector: 'app-dialog',
  styleUrls: ['./workers-list.component.scss'],
  template: `<div class="d-flex justify-content-between align-items-start"><h1 mat-dialog-title>Worker Name</h1><div class="close" (click)="onNoClick()" style="cursor: pointer; padding-top: 3px"><span class="material-icons"> close </span></div></div>
  <form  [formGroup]="addWorkerNameForm">
  <div mat-dialog-content style="overflow:hidden;">
    <div class="Equipment-form wquipment-popup w-100">
      <mat-form-field [floatLabel]="'never'" appearance="none" class="example-full-width w-100 addWorkerModelName" [ngClass]="{'input-error':isSubmitted && addWorkerNameForm.controls.name.invalid}">
          <input type="text" matInput [(ngModel)]="data.name" formControlName="name"  placeholder="Enter Worker Name" [autocomplete]="'off'"   />
      </mat-form-field>
      <mat-error *ngIf="isExists && data.name == existingName">Name already exists.</mat-error>
    </div>
  </div>
  <div mat-dialog-actions class="d-flex justify-content-end">
    <!-- <button mat-button (click)="onNoClick()">No Thanks</button> -->
    <button mat-button (click)="onOkClick()" cdkFocusInitial class="add-btn add-btn2">Ok</button>
  </div>
</form>`
})
export class DialogComponent implements OnInit {
  workerData: Worker = new Worker();
  addWorkerNameForm: FormGroup;
  isSubmitted = false;
  isExists = false;
  existingName = '';
  _workerID = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private workerService: WorkerService,
    private ref: ChangeDetectorRef,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnInit(): void {
    this.addWorkerNameForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick() {
    this.isSubmitted = true;
    if (this.addWorkerNameForm.invalid) {
      for (const i in this.addWorkerNameForm.controls) {
        this.addWorkerNameForm.controls[i].markAsDirty();
        this.addWorkerNameForm.controls[i].updateValueAndValidity();
      }
      return;
    }


    this.createWorkerID(this.workerService.userData);

    if (this.data.name.trim() == null || this.data.name.trim() == "") {
      this.toastService.errorMsg("Please Enter Worker Name"); return false;
    }
    if (this._workerID) {
      this.workerData.org = this.workerService.userData.org;
      this.workerData.orgID = this.workerService.userData.orgID;
      this.workerData.plant = this.workerService.userData.plant;
      this.workerData.plantID = this.workerService.userData.plantID;
      this.workerData.timestamp = this.workerService.userData.timestamp ? this.workerService.userData.timestamp : '';
      this.workerData.status = 'ACTIVE';
      this.workerData.user = this.workerService.userData.userName;
      this.workerData.userID = this.workerService.userData.userID;
      this.workerData.worker = new Details()
      this.workerData.worker.name = this.data.name;
      this.workerData.worker._workerID = this._workerID;
      this.workerData.worker.email = this._workerID + '@pridikt.net';
      this.workerData.worker.status = 'ACTIVE';

      this.isExists = false;
      this.existingName = '';
      this.workerService.createWorkerDetail(this.workerData).subscribe(res => {
        let newArray = [];
        if (res && res['status'] != 'CONFLICT') {
          this.workerService.workerData.next(res['data']);
          this.workerService.workerList.value.push(res['data']);
          this.workerService.workerList.next(this.workerService.workerList.value);
          this.dialogRef.close();
          this.router.navigate(['workers/', res['data'].id]);

        } else {
          this.workerService.workerData.next(new Worker());
        }
      }, err => {
        if (err['error']['status'] == 'CONFLICT') {
          this.isExists = true;
          this.existingName = this.workerData.worker['name'];
          this.workerService.workerData.next(new Worker());
        }
      });
    }
  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.dialogRef.close();
  }

  createWorkerID(data) {
    this.workerService.workerList.subscribe((res) => {
      if (res) {
        if (res.length >= 1)
          this._workerID = data.orgID + '-' + data.plantID + '-worker-' + ((res.length) + 1);
        else if ((res.length - 1) == 0 || res.length == 0)
          this._workerID = data.orgID + '-' + data.plantID + '-worker-' + 1;
      }
    });
  }


  removeExtraSpaceAndConvertLowercase(value) {
    let replaceValue = value.split(" ").join("");
    return replaceValue.toLocaleLowerCase();
  }

}
