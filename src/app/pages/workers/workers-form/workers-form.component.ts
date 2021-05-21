import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiResponse } from 'src/app/core/model/user-login';
import { Worker } from 'src/app/core/model/worker';
import { ToastService } from 'src/app/core/services/toast.service';
import { WorkerService } from 'src/app/core/services/worker.service';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-workers-form',
  templateUrl: './workers-form.component.html',
  styleUrls: ['./workers-form.component.scss']
})
export class WorkersFormComponent implements OnInit {

  name: string;
  id: string;
  data: Worker;
  subs: Subscription = new Subscription

  constructor(private route: ActivatedRoute,
    private workerService: WorkerService,
    private toastService: ToastService,
    private router: Router,
    private commonService: CommonService) {
    this.route.paramMap.subscribe(paramsMap => {
      this.id = paramsMap.get('id');
      this.name = paramsMap.get('name');
      if (this.id)
        this.getWorkerDataById(this.id);
    });
    this.workerService.workerData.subscribe(res => {
      if (res) {
        this.data = res;
      }
    });
  }

  ngOnInit(): void {
    if (this.router.url == '/workers') {


    }
  }

  getWorkerDataById(id) {
    this.subs.add(this.workerService.getWorkersById(id).subscribe((res: ApiResponse | Worker | any) => {
      if (res && res.data) {
        this.name = res.data.worker.name;
        this.workerService.workerData.next(res.data);
      } else if (res) {
        this.name = res.worker.name;
      }
    }, err => {
      this.toastService.errorMsg(err);
    }))
  }
}
