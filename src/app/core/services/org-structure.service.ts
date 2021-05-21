import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrgStructure, Position } from '../model/org-structure';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class OrgStructureService {
  private _jsonURL = '../assets/orgStructure.json';
  orgStructureHierarchyOpend: BehaviorSubject<any> = new BehaviorSubject({ i: { index: 0, name: '' }, j: { index: 0, name: '' }, k: { index: 0, name: '' } });
  orgStructureHierarchy: BehaviorSubject<OrgStructure> = new BehaviorSubject(new OrgStructure());
  orgStructureHierarchyPosition: BehaviorSubject<OrgStructure[]> = new BehaviorSubject([]);


  positionData: BehaviorSubject<Position> = new BehaviorSubject(new Position());
  private positionDataLocal = new Position();

  private orgStructureHierarchyLocal = new OrgStructure();
  private orgStructureHierarchyPositionLocal = [];



  constructor(private httpClient: HttpClient, private commonService: CommonService) {

    this.orgStructureHierarchy.subscribe(res => { this.orgStructureHierarchyLocal = res; });
    this.orgStructureHierarchyPosition.subscribe(res => { this.orgStructureHierarchyPositionLocal = res; });
    this.positionData.subscribe(res => { this.positionDataLocal = res; });
  }

  getOrgStructureHierarchy(param) {
    // return this.httpClient.get(this._jsonURL);
    if (this.orgStructureHierarchyLocal && this.orgStructureHierarchyLocal.id) {
      return this.orgStructureHierarchy;
    } else {
      const params = new HttpParams().set('orgID', param.orgID).set('page', param.page).set('plantID', param.plantID).set('size', param.size);
      return this.httpClient.get(`${environment.baseUrl}/org/api/v1/orgStructure/getAllOrgStructures`, { params })
    }

  }

  // getOrgStructureById(param) {
  //   const params = new HttpParams().set('page', param.page).set('size', param.size);
  //   return this.http.get(`${environment.baseUrl}/assets/api/v1/assets/area/${id}`, { params }).pipe(catchError(this.commonService.handleError));
  // }

  createSaveOrgStructure(model) {
    return this.httpClient.post(`${environment.baseUrl}/org/api/v1/orgStructure/createOrgStructure`, model)
  }

  updateOrgStructure(id, data) {
    return this.httpClient.put(`${environment.baseUrl}/org/api/v1/orgStructure/updateOrgStructure/${id}`, data)
  }

  clearOrgStructureServiceBehaviorSubjectData() {
    this.orgStructureHierarchy.next(null);
    this.positionData.next(null);
    this.orgStructureHierarchyPositionLocal = [];
    this.orgStructureHierarchyPosition = null;
    !this.orgStructureHierarchyPosition ? '' : this.orgStructureHierarchyPosition.next(null);
    this.orgStructureHierarchyLocal = null;
  }


}






