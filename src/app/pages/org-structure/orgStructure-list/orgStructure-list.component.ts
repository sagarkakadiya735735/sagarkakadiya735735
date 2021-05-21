
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { orgStructureHeaderLayer } from 'src/app/core/enums/roles.enum';
import { Assets } from 'src/app/core/model/assets';
import { Department, OrgStructure, orgStructureParams, Position } from 'src/app/core/model/org-structure';
import { workersList } from 'src/app/core/model/worker';
import { CommonService } from 'src/app/core/services/common.service';
import { OrgStructureService } from 'src/app/core/services/org-structure.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { WorkerService } from 'src/app/core/services/worker.service';
import { AddNameComponent, AddNameModel } from 'src/app/shared/shared/add-name/add-name.component';

export interface PeriodicElement {
  Name: string;
  Worker: string;
  Email: string;
  Phone: string;
  Action: string;
}

interface Food {
  value: string;
  viewValue: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    Name: 'Pavan Kothapalli',
    Worker: 'AHDJ7812A',
    Email: 'pavan@megrapetro.com',
    Phone: '+1(248)248-2468',
    Action: '',
  },
  {
    Name: 'John Doe',
    Worker: 'AHDJ939N',
    Email: 'john@megrapetro.com',
    Phone: '+1(248)248-2468',
    Action: '',
  },
  {
    Name: 'Pavan Kothapalli',
    Worker: 'AHDJ7812A',
    Email: 'pavan@megrapetro.com',
    Phone: '+1(248)248-2468',
    Action: '',
  },
  {
    Name: 'John Doe',
    Worker: 'AHDJ939N',
    Email: 'john@megrapetro.com',
    Phone: '+1(248)248-2468',
    Action: '',
  },
];



@Component({
  selector: 'app-workers-list',
  templateUrl: './orgStructure-list.component.html',
  styleUrls: ['./orgStructure-list.component.scss'],
})
export class orgStructureListComponent implements OnInit {

  subs: Subscription = new Subscription();
  loginForm: any;
  id: string;
  displayedColumns: string[] = ['Name', 'Worker', 'Email', 'Phone', 'Action'];

  dataSource = ELEMENT_DATA;
  sidebarSelected;
  assetsData: Assets = new Assets();
  params = new orgStructureParams();
  sidebarData: OrgStructure = new OrgStructure();
  orgStructureData: OrgStructure = new OrgStructure();
  nestedBar: OrgStructure;
  userData: any;
  isDepartmentId = false;
  checkActivePositionTabId = '';
  checkCurrentexpandIndex: any;



  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private workerService: WorkerService,
    private orgStructureService: OrgStructureService,
    private toastService: ToastService) {

  }

  ngOnInit(): void {
    this.userData = this.commonService.getTokenData();
    this.params.page = 0;
    this.params.size = 10;
    this.params.orgID = this.userData.orgID;
    this.params.plantID = this.userData.plantID;
    this.getSidebar(this.params);
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.checkActivePositionTabId = atob(this.id);
      if (this.router.url == '/orgstructure') {
        this.isDepartmentId = false;
        this.checkCurrentexpandIndex == 0;
      } else {
        this.isDepartmentId = true;
      }

      this.orgStructureService.orgStructureHierarchy.subscribe(res => {
        if (res) {
          res.department.forEach((item, index) => {
            item.position.forEach((positionItem, positionIndex) => {
              if (this.id && positionItem._positionID == atob(this.id)) {
                this.checkCurrentexpandIndex = index;
              }
            })
          })
        }
      })

      if (!this.id)
        this.checkCurrentexpandIndex = 0;
      // if (this.router.url.includes('/orgstructure') && this.id) {
      //   this.subs.add(
      //     this.orgStructureService.getOrgStructureById(this.id).subscribe((res: any) => {
      //       if (res && res["data"]) {
      //         this.assetsData = res['data']
      //         this.orgStructureService.positionData.next(res["data"]);
      //       } else if (res) {
      //         this.assetsData = res;
      //       }
      //     }, err => {
      //       this.toastService.errorMsg(err);
      //       this.assetsData = new Assets();
      //     })
      //   )
      // }
    });



    this.orgStructureService.orgStructureHierarchyOpend.subscribe(res => {
      if (res) {
        this.sidebarSelected = res;
        if (this.router.url == '/orgstructure') {
          setTimeout(() => {
            if (this.nestedBar && this.sidebarSelected && this.sidebarSelected.j.index >= 0) {
              this.getPosition(this.nestedBar['department'][this.sidebarSelected.i.index]['position'][this.sidebarSelected.j.index], this.sidebarSelected.i.index, this.sidebarSelected.j.index);
            }
          }, 1000);
        }
      }
    },
      err => {
        this.toastService.errorMsg(err);
      });
  }


  getSidebar(params) {
    this.orgStructureService.getOrgStructureHierarchy(params).subscribe((res: any) => {
      if (res && res["data"]) {
        this.sidebarData = res["data"].content[0];
        this.nestedBar = res["data"].content[0];
        this.orgStructureService.orgStructureHierarchy.next(res["data"].content[0]);
      } else if (res) {
        this.sidebarData = res;
        this.nestedBar = res;
      }
    }, err => {
      this.toastService.errorMsg(err);
    })
  }

  addNameDialog(element, type, i?: number, j?: number, isEdit?: boolean, hierarchyString?: string): void {
    let layerWiseHeaderName: any;
    if (type == 'addLayer1')
      layerWiseHeaderName = orgStructureHeaderLayer["addLayer1HeaderName"];
    else if (type == 'addLayer2')
      layerWiseHeaderName = orgStructureHeaderLayer["addLayer2HeaderName"];

    const dialogData = new AddNameModel(layerWiseHeaderName, '', '', element, type, isEdit, hierarchyString);
    const dialogRef = this.dialog.open(AddNameComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      let userData = this.commonService.getTokenData();
      if (dialogResult && dialogResult.checked) {
        let data = this.nestedBar;
        if (type == 'addLayer1') {
          let isCreate = false;
          if (!data) {
            let data = new OrgStructure();
            this.nestedBar = new OrgStructure();
            data.org = userData.org;
            data.orgID = userData.orgID;
            data.plant = userData.plant;
            data.plantID = userData.plantID;
            data.status = userData.status;
            data.validFrom = "string";
            data.validTo = "string";
            // data.user = userData.user;
            // data.userID = userData.userID;
            this.nestedBar.org = userData.org;
            this.nestedBar.orgID = userData.orgID;
            this.nestedBar.plant = userData.plant;
            this.nestedBar.plantID = userData.plantID;
            this.nestedBar.status = userData.status;
            this.nestedBar.validFrom = "string";
            this.nestedBar.validTo = "string";
            // this.nestedBar.user = userData.user;
            // this.nestedBar.userID = userData.userID;
            isCreate = true;
          }
          if (isEdit)
            this.nestedBar.department[i].name = dialogResult.name;
          else {
            let department = new Department();
            department.name = dialogResult.name;
            department.status = 'ACTIVE';
            department.timestamp = (new Date()).toString();
            department.sequenceNumber = (this.getSequence()).toString();
            department._departmentID = this.createDepartmentId(department.sequenceNumber, department.name);
            department.position = [];
            if (data && data.department) {
              data.department.push(department);
            }
            else {
              data['department'] = [department];
            }
          }
          if (isCreate) {
            this.orgStructureService.createSaveOrgStructure(data).subscribe(res => {
              this.nestedBar = res['data'];
              this.orgStructureService.orgStructureHierarchy.next(res['data']['content'])
            }, err => {
              this.toastService.errorMsg(err);
            })
          } else {
            this.orgStructureService.updateOrgStructure(data.id, data).subscribe(res => {
              this.toastService.savedataMsg(res['message']);
            }, err => {
              this.toastService.errorMsg(err);
            })
          }
        } else if (type == 'addLayer2') {
          if (isEdit) {
            data.department[i].position[j].name = dialogResult.name;
          }
          else {
            let position: Position = new Position();
            position.sequenceNumber = (this.getPositionSeq(i)).toString();
            position.name = dialogResult.name;
            position._positionID = this.nestedBar.department[i]._departmentID + '-' + this.removeExtraSpaceAndConvertLowercase(position.name) + '-' + position.sequenceNumber;
            position.status = 'ACTIVE';
            if (data.department[i] && data.department[i].position) {
              data.department[i].position.push(position);
            } else {
              data.department[i]['position'] = [position];
            }
          }
          this.orgStructureService.updateOrgStructure(data.id, data).subscribe(res => { this.toastService.savedataMsg(res['message']); }, err => { this.toastService.errorMsg(err); })
        }
      }
    });
  }


  getSequence() {
    if (this.nestedBar.department && this.nestedBar.department.length > 0) {
      return Math.max.apply(Math, this.nestedBar.department.map(function (item) {
        return +item.sequenceNumber;
      })) + 1;
    } else {
      return 1;
    }
  }

  getPositionSeq(i) {
    if (this.nestedBar.department[i].position && this.nestedBar.department[i].position.length > 0) {
      return Math.max.apply(Math, this.nestedBar.department[i].position.map(function (o) {
        return +o.sequenceNumber;
      })) + 1;
    } else {
      return 1;
    }
  }
  createDepartmentId(id, dept) {
    return this.nestedBar.orgID + '-' + this.nestedBar.plantID + '-' + this.removeExtraSpaceAndConvertLowercase(dept) + '-' + id;
  }

  removeExtraSpaceAndConvertLowercase(value) {
    let replaceValue = value.split(" ").join("");
    return replaceValue.toLocaleLowerCase();
  }

  departmentChecked(data, i?: number, j?: number, k?: number) {
    this.checkActivePositionTabId = data._positionID;
    this.checkCurrentexpandIndex = i;
    this.orgStructureService.positionData.next(data);
    this.orgStructureService.orgStructureHierarchyOpend.next({
      i: { index: i, name: this.nestedBar['department'][i]['name'] },
      j: { index: j, name: this.nestedBar['department'][i]['position'][j]['name'] }
    });
    this.router.navigate(['orgstructure', btoa(data._positionID)]);

  }

  submitForm() { }
  get val() {
    return this.loginForm.controls;
  }

  getPosition(data, i, j) {
    if (data._positionID) {
      this.orgStructureService.orgStructureHierarchyPosition.next(data);
    }
  }



  selectedValue: string;

  foods: Food[] = [
    { value: 'steak-0', viewValue: 'Mechanical' },
    { value: 'pizza-1', viewValue: 'Mechanical' },
    { value: 'tacos-2', viewValue: 'Mechanical' },
  ];

  panelOpenState = false;
}
