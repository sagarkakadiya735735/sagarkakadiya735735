import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { Attribute } from '../model/attribute';
import { User } from '../model/user';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  attributeList: BehaviorSubject<Attribute[]> = new BehaviorSubject([]);
  private attributeListLocal = [];
  pageArraylocal = [];
  attributeData: BehaviorSubject<Attribute> = new BehaviorSubject(new Attribute());
  private attributeDataLocal = new Attribute();

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.attributeList.subscribe(res => { this.attributeListLocal = res; });
    this.attributeData.subscribe(res => { this.attributeDataLocal = res; });
    console.log(this.attributeData.value,"this.attributeData");
    console.log(this.attributeDataLocal,"this.attributeData");

  }

  getAllAttruibute(param, pageArray) {
    if (pageArray.includes(param.page)) {
      return this.attributeList;
    } else {
      const params = new HttpParams().set('page', param.page).set('name', param.name).set('size', param.size).set('orgID', param.orgID).set('plantID', param.plantID);
      return this.http.get(`${environment.baseUrl}/templateapi/v1/templates/getAllTemplates`, { params });
    }
  }

  getAttruibuteById(id) {
    console.log(this.attributeDataLocal,this.attributeDataLocal.id,"this.attributeDataLocal.id");

    if (this.attributeDataLocal.id == id) {
      return this.attributeData;
    } else {
      return this.http.get(`${environment.baseUrl}/templateapi/v1/templates/${id}`).pipe(catchError(this.commonService.handleError));
    }
  }

  saveAttruibuteById(id, data) {
    return this.http.put(`${environment.baseUrl}/templateapi/v1/templates/updateTemplate/${id}`, data).pipe(catchError(this.commonService.handleError));
  }

  createAttruibute(data) {
    return this.http.post(`${environment.baseUrl}/templateapi/v1/templates/createTemplate`, data).pipe(catchError(this.commonService.handleError));
  }

  clearAttributeServiceBehaviorSubjectData() {
    this.attributeData.next(this.attributeDataLocal);
    this.attributeList.next(this.attributeListLocal);
    this.pageArraylocal = [];
    this.attributeListLocal = [];
    this.attributeDataLocal = null;
  }

  updateAllAttributeData(data) {
    this.attributeListLocal.forEach(el => {
      if(el.id == data.id) { el = data; }
    })
    this.attributeList.next(this.attributeListLocal);
  }
}
