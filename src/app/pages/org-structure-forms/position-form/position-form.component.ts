import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrgStructure, Position } from 'src/app/core/model/org-structure';
import { workersList } from 'src/app/core/model/worker';
import { CommonService } from 'src/app/core/services/common.service';
import { OrgStructureService } from 'src/app/core/services/org-structure.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { WorkerService } from 'src/app/core/services/worker.service';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss']
})
export class PositionFormComponent implements OnInit {

  id: string;
  positionForm: FormGroup;
  data: OrgStructure = new OrgStructure();
  gridData: Position = new Position();
  workerData = [];
  Status = [
    {
      label: 'Yes',
      value: 'Active'
    },
    {
      label: 'No',
      value: 'Deactive'
    }
  ]
  ShiftData = [
    {
      label: 'Shift-1(day) 8-2 PM',
      value: 'Shift-1(day) 8-2 PM'
    },
    {
      label: 'Shift-2(day) 2-10 PM',
      value: 'Shift-2(day) 2-10 PM'
    }
  ]


  constructor(private formBuilder: FormBuilder, private commonService: CommonService, private route: ActivatedRoute,
    private workerService: WorkerService,
    private orgStructureService: OrgStructureService,
    private toastService: ToastService
  ) {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.id) {
        this.orgStructureService.orgStructureHierarchy.subscribe((res) => {
          if (res) {
            this.data = res;
            this.bindPositionData(res)
          }
        })
      }
    });


  }

  ngOnInit(): void {

    this.getWorkerData();
    this.positionForm = this.formBuilder.group({
      _positionID: [''],
      title: [''],
      assignedWorker: [''],
      shift: [''],
      status: ['']
    });
  }

  bindPositionData(res) {
    let currentElement = res;
    res['department'].forEach(element => {
      element.position.forEach(elementPosition => {
        if (elementPosition._positionID == (atob(this.id))) {
          this.gridData = elementPosition;
        }
      });
    });
    setTimeout(() => {
      this.positionForm.patchValue({
        _positionID: this.gridData._positionID,
        title: this.gridData.title,
        assignedWorker: this.gridData.assignedWorker,
        shift: this.gridData.shift,
        status: this.gridData.status
      })
    }, 500);

  }

  async getWorkerData() {
    let element: any;
    let params: workersList = new workersList();
    params.page = 0;
    params.size = 999;
    params.name = '';
    (await this.workerService.getAllWorkersData(params, this.workerService.pageArraylocal)).subscribe((res) => {
      this.workerData = [];
      if (res && res.data)
        element = res.data.content;
      else if (res && !res.data)
        element = res;
      element.forEach(item => {
        let currentItem = {
          name: item.worker.name
        }
        this.workerData.push(currentItem);
      });
    })
  }

  get val() {
    return this.positionForm.controls;
  }

  savePositionFormData() {
    if (this.positionForm.invalid) {
      for (const i in this.positionForm.controls) {
        this.positionForm.controls[i].markAsDirty();
        this.positionForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    this.data['department'].forEach(element => {
      element.position.forEach(elementPosition => {
        if (elementPosition._positionID == (atob(this.id))) {
          elementPosition._positionID = this.gridData._positionID;
          elementPosition.title = this.val.title.value;
          elementPosition.assignedWorker = this.val.assignedWorker.value;
          elementPosition.shift = this.val.shift.value;
          elementPosition.status = this.val.status.value;
        }
      });
    });

    this.orgStructureService.updateOrgStructure(this.data.id, this.data).subscribe((res) => {
      this.orgStructureService.orgStructureHierarchy.next(res['data']);
      this.toastService.savedataMsg(res['message']);
    },
      err => {
        this.toastService.errorMsg(err);
      });
  }

}
