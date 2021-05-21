import { filter } from 'rxjs/operators';
import { Address } from './../../../core/model/worker';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiResponse } from 'src/app/core/model/user-login';
import { WorkerService } from 'src/app/core/services/worker.service';
import { Worker } from 'src/app/core/model/worker';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ToastService } from 'src/app/core/services/toast.service';
import { environment } from 'src/environments/environment';
import { AssetsService } from 'src/app/core/services/assets.service';
import { CommonService } from 'src/app/core/services/common.service';
import { ENTER } from '@angular/cdk/keycodes';

interface Food {
  value: string;
  viewValue: string;
}

interface Phone {
  value: string;
  viewValue: string;
}


@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
})
export class ProfileDetailsComponent implements OnInit {

  sub: Subscription = new Subscription();
  workerDetail: Worker;
  gridData: Worker;
  profileDetailForm: FormGroup;
  isCheckWorkerUrl: boolean;
  selectedValue: string;
  permitToWorkArray = [];
  separatorKeysCodes: number[] = [ENTER];
  sequenceNumber: any;
  countryData: any;
  selectedCountry: any;
  countryCode: any;

  constructor(private formBuilder: FormBuilder,
    private assetsService: AssetsService,
    private commonService: CommonService,
    private router: Router,
    private toastService: ToastService,
    private workerService: WorkerService) {

  }

  ngOnInit(): void {
    this.getCountryData();
    this.getAllAssetsData();
    this.profileDetailForm = this.formBuilder.group({
      _workerID: [''],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      city: [''],
      country: [''],
      street: [''],
      zip: ['', [Validators.maxLength(6), Validators.minLength(6)]],
      permitToWork: [[]]
    });

    this.isCheckWorkerUrl = this.router.url.includes('/workers');
    if (this.isCheckWorkerUrl) {
      this.workerService.workerData.subscribe((res) => {
        if (res) {
          this.workerDetail = res;
          this.fetchProfileDetail(res);
        }
      },
        (err) => {
          this.toastService.errorMsg(err);
          this.workerDetail = new Worker();
        });
    }

  }


  getAllAssetsData() {
    this.permitToWorkArray = [];
    let userData = this.commonService.getTokenData();
    let params = {
      page: 0,
      size: 999,
      orgID: userData.orgID,
      plantID: userData.plantID
    }
    this.assetsService.getAllAssetsData(params).subscribe(res => {
      if (res) {
        res['data'].content.forEach(element => {
          let item = {
            value: element.assetName,
            label: element.assetName
          }
          this.permitToWorkArray.push(item);
        });

      }
    },
      err => {
        this.toastService.errorMsg(err);
      });

  }

  fetchProfileDetail(data) {
    this.sequenceNumber = '';
    this.countryCode = '';
    if (data && data.id) {
      this.gridData = data;
      let element = data.worker;
      this.profileDetailForm.patchValue({
        _workerID: element._workerID,
        name: !!element.name ? element.name : '',
        email: !!element.email && element.email.includes('@pridikt.net') ? '' : element.email,
        phone: element.phone,
        city: !!element.address ? element.address.city : '',
        street: !!element.address ? element.address.street : '',
        zip: !!element.address ? element.address.zip : '',
        permitToWork: !!element.permitToWork ? element.permitToWork.functionalGroupOfAssets : []
      });


      if (this.gridData.worker.sequenceNumber) {
        this.sequenceNumber = this.gridData.worker.sequenceNumber;
      }
      else {
        this.workerService.workerList.subscribe((res) => {
          if (res) {
            if (res.length == 0)
              this.sequenceNumber = 1;
            else
              this.sequenceNumber = res.length + 1;
          }
        });
      }

      if (this.countryData) {
        this.countryData.forEach(item => {
          if (!element.address && !element.countryCode && item.name == 'United States of America') {
            this.val.country.setValue(item.name);
            this.countryCode = '+ ' + item['callingCodes'][0];
          }
          else if (!!element.address && !!element.countryCode) {
            this.val.country.setValue(element.address.country);
            this.countryCode = element.countryCode;
          }
        });
      }
    }
  }

  get val() {
    return this.profileDetailForm.controls;
  }

  saveWorkerDetail() {
    if (this.profileDetailForm.invalid) {
      for (const i in this.profileDetailForm.controls) {
        this.profileDetailForm.controls[i].markAsDirty();
        this.profileDetailForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    // let userData = JSON.parse(atob(localStorage.getItem(environment.dataKey))).data;
    let worker: Worker = new Worker();
    worker.id = this.gridData.id;
    worker.orgID = this.gridData.orgID;
    worker.plant = this.gridData.plant;
    worker.plantID = this.gridData.plantID;
    worker.status = this.gridData.status;
    worker.timestamp = this.gridData.timestamp;
    worker.user = this.gridData.user;
    worker.userID = this.gridData.userID;
    worker.worker = {
      _workerID: this.val._workerID.value,
      address: {
        city: this.val.city.value,
        country: this.val.country.value,
        street: this.val.street.value,
        zip: this.val.zip.value
      },
      countryCode: this.countryCode,
      email: !!this.val.email.value ? this.val.email.value : this.gridData.worker.email,
      name: this.val.name.value,
      permitToWork: {
        functionalGroupOfAssets: this.val.permitToWork.value
      },
      phone: this.val.phone.value,
      sequenceNumber: this.sequenceNumber.toString(),
      status: this.gridData.status
    }



    this.sub.add(this.workerService.updateWorkerDeatailById(this.gridData.id, worker).subscribe((res: HttpResponse<any>) => {
      if (res.status.toString() == 'OK') {
        this.workerService.workerData.next(res['data']);
        this.toastService.successMsg('', 'Worker detail update successfully!!');
        this.router.navigate['workers'];
      }
    },
      err => {
        this.toastService.errorMsg(err);
      }))

  }


  onToppingRemoved(topping: string, key) {
    const toppings = this.val[key].value as string[];
    this.removeFirst(toppings, topping);
    this.val[key].setValue(toppings); // To trigger change detection
  }


  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  selected(event, key): void {
    if (this.val[key].value.indexOf(event) == -1 && event.trim().length > 0) {
      this.val[key].value.push(event);
    }
  }

  getCountryData() {
    this.selectedCountry = '';
    this.countryCode = '';
    this.commonService.countryData_.subscribe((res) => {
      if (res) {
        this.countryData = res;
      }
    },
      err => {
        this.toastService.errorMsg(err);
      })
  }

  // changeCountry(event) {
  //   if (event) {
  //     this.countryData.forEach(item => {
  //       if (item.name == event)
  //         this.val.countryCode.setValue('+ ' + item['callingCodes'][0]);
  //     });
  //   }
  // }

  getCountryCode(data) {
    this.countryCode = '+ ' + data['callingCodes'][0];
  }

  reset() {
    this.fetchProfileDetail(this.workerDetail)
  }

}
