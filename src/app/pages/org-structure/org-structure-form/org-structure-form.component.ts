import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { OrgStructureService } from 'src/app/core/services/org-structure.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { WorkerService } from 'src/app/core/services/worker.service';

@Component({
  selector: 'app-org-structure-form',
  templateUrl: './org-structure-form.component.html',
  styleUrls: ['./org-structure-form.component.scss']
})
export class OrgStructureFormComponent implements OnInit {


  id: string;
  isDepartmentId = false;
  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router,
    private workerService: WorkerService,
    private orgStructureService: OrgStructureService,
    private toastService: ToastService) { }

  ngOnInit(): void {

    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.router.url == '/orgstructure') {
        this.isDepartmentId = false;
      } else {
        this.isDepartmentId = true;
      }

    });

  }
}
