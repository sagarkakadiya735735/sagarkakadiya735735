import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { AssetHierarchy, Assets } from '../model/assets';
import { catchError } from 'rxjs/operators';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {
  assetsHierarchyOpend: BehaviorSubject<any> = new BehaviorSubject({ i: { index: 0, name: '' }, j: { index: 0, name: '' }, k: { index: 0, name: '' } });
  assetsHierarchy: BehaviorSubject<AssetHierarchy> = new BehaviorSubject(new AssetHierarchy());
  private assetsHierarchyLocal = new AssetHierarchy();
  assetsHierarchyArea: BehaviorSubject<Assets[]> = new BehaviorSubject([]);
  private assetsHierarchyAreaLocal = [];

  assetsData: BehaviorSubject<Assets> = new BehaviorSubject(new Assets());
  private assetsDataLocal = new Assets();

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.assetsHierarchy.subscribe(res => { this.assetsHierarchyLocal = res; });
    this.assetsHierarchyArea.subscribe(res => { this.assetsHierarchyAreaLocal = res; });
    this.assetsData.subscribe(res => { this.assetsDataLocal = res; });
  }

  getAssetsHierarchy(param) {
    if (this.assetsHierarchyLocal && this.assetsHierarchyLocal.id) {
      return this.assetsHierarchy;
    } else {
      const params = new HttpParams().set('page', param.page).set('size', param.size).set('apikey', 'apikey').set('orgID', param.orgID).set('plantID', param.plantID);
      return this.http.get(`${environment.baseUrl}/assetHierarchy/api/v1/assethierarchy/getAllAssetHierarchy`, { params }).pipe(catchError(this.commonService.handleError));
    }
  }

  getAssetsHierarchyByAreaId(id, param) {
    // debugger;
    // if(this.assetsHierarchyAreaLocal.length > 0) {
    //   return this.assetsHierarchyArea;
    // } else {
    const params = new HttpParams().set('page', param.page).set('size', param.size);
    return this.http.get(`${environment.baseUrl}/assets/api/v1/assets/area/${id}`, { params }).pipe(catchError(this.commonService.handleError));
    // }
  }

  saveAssetHierarchyById(id, data) {
    return this.http.put(`${environment.baseUrl}/assetHierarchy/api/v1/assethierarchy/updateAssetHierarchy/${id}`, data).pipe(catchError(this.commonService.handleError));
  }


  createAssetHierarchyById(data) {
    return this.http.post(`${environment.baseUrl}/assetHierarchy/api/v1/assethierarchy/createAssetHierarchy`, data).pipe(catchError(this.commonService.handleError));
  }

  getAssetsById(id) {
    if (this.assetsDataLocal.id == id) {
      return this.assetsData;
    } else {
      return this.http.get(`${environment.baseUrl}/assets/api/v1/assets/${id}`).pipe(catchError(this.commonService.handleError));
    }
  }

  createAsset(data) {
    return this.http.post(`${environment.baseUrl}/assets/api/v1/assets/createAsset`, data).pipe(catchError(this.commonService.handleError));
  }

  getAllAssetsData(param) {
    const params = new HttpParams().set('page', param.page).set('size', param.size).set('orgID', param.orgID).set('plantID', param.plantID);
    return this.http.get(`${environment.baseUrl}/assets/api/v1/assets/getAllAssets`, { params });
  }

  saveAssetsById(id, data) {
    return this.http.put(`${environment.baseUrl}/assets/api/v1/assets/updateAsset/${id}`, data).pipe(catchError(this.commonService.handleError));
  }

  clearAssetsBehaviourSubjectData() {
    this.assetsHierarchy.next(null);
    this.assetsData.next(null);
    this.assetsHierarchyAreaLocal = [];
    this.assetsHierarchyArea.next(null);
  }

  updateAllAssetsData(data: Assets) {
    this.assetsHierarchyLocal.floc.forEach(el => {
      if (el && el._flocID == data._flocID && el.area) {
        el.area.forEach(ele => {
          if (ele && ele._areaID == data._areaID && ele.area) {
            ele.area.forEach(elem => {
              if (elem.id == data.id) { elem = data; }
            })
          }
        })
      }
    })
    this.assetsHierarchy.next(this.assetsHierarchyLocal);
  }
}
