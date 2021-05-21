import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AssetHierarchy } from '../model/assets';
import { Worker } from '../model/worker';
import { element } from 'protractor';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class WorkerService {
  workerList: BehaviorSubject<Worker[]> = new BehaviorSubject([]);
  private workerListLocal = [];
  pageArraylocal = [];
  workerData: BehaviorSubject<Worker> = new BehaviorSubject(new Worker());
  private workerDataLocal = new Worker();
  userData;


  constructor(private http: HttpClient, private commonService: CommonService) {
    // this.pageArraylocal = [];
    this.workerList.subscribe(res => { this.workerListLocal = res; });
    this.workerData.subscribe(res => { this.workerDataLocal = res; });
    this.userData = JSON.parse(atob(localStorage.getItem(environment.dataKey))).data;
  }

  getAllWorkersData(param, pageArray) {
    if (pageArray.includes(param.page)) {
      return this.workerList;
    } else {
      const params = new HttpParams().set('page', param.page).set('size', param.size).set('orgID', this.userData.orgID).set('plantID', this.userData.plantID).set('name', param.name);
      return this.http.get(`${environment.baseUrl}/worker/api/v1/worker/getAllWorkers`, { params }).pipe(catchError(this.commonService.handleError));
    }
  }

  getWorkersById(id) {
    if (this.workerDataLocal.id == id)
      return this.workerData;
    else
      return this.http.get(`${environment.baseUrl}/worker/api/v1/worker/${id}`).pipe(catchError(this.commonService.handleError));
  }

  createAssetHierarchyById(data) {
    return this.http.post(`${environment.baseUrl}/assetHierarchy/api/v1/assethierarchy/createAssetHierarchy/`, data).pipe(catchError(this.commonService.handleError));
  }



  createWorkerDetail(data) {
    return this.http.post(`${environment.baseUrl}/worker/api/v1/worker/createWorker`, data).pipe(catchError(this.commonService.handleError));
  }

  updateWorkerDeatailById(id, data) {
    return this.http.put(`${environment.baseUrl}/worker/api/v1/worker/updateWorker/${id}`, data).pipe(catchError(this.commonService.handleError));
  }

  clearWorkerServiceBehaviorSubjectData() {
    this.workerData.next(this.workerDataLocal);
    this.workerList.next(this.workerListLocal);
    this.pageArraylocal = [];
    this.workerListLocal = [];
    this.workerDataLocal = null;
  }
}
