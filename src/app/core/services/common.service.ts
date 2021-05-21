
import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  public countryData_ = new BehaviorSubject(null);
  private countryData;

  constructor(private toastrService: ToastrService, private httpClient: HttpClient, private router: Router) {
    this.getWholeCountryDetailApi();
    this.countryData_.subscribe(res => { this.countryData = res; });
  }

  createParams(paramObj) {
    let params = new HttpParams();
    Object.keys(paramObj).forEach((ele) => {
      params.set(ele, paramObj[ele]);
    });
    return params;
  }
  getTokenData() {
    return JSON.parse(atob(localStorage.getItem(environment.dataKey))).data;
  }

  checkUpdateDataWithAttributeList(data, updateRecord, string) {
    if (updateRecord) {
      data.forEach(element => {
        if (element.id == updateRecord.id) {
          if (string == 'equipment') {
            element.name = updateRecord.name;
            element.general = updateRecord.general;
          }
          else if (string == 'workers') {
            element.worker.name = updateRecord.worker.name;
            element.worker = updateRecord.worker;
          }
        }
      });
    }
    return data;
  }

  getWholeCountryDetailApi() {
    fetch('https://restcountries.eu/rest/v2/all?fields=name;callingCodes;alpha3Code;alpha2Code;flag')
      .then(res => res.json())
      .then(data => this.getWholeCountryDetail(data))
      .catch(err => console.log('Error:', err.message));
  }

  getWholeCountryDetail(res) {
    if (!this.countryData) {
      if (res) {
        this.countryData = res;
        this.countryData_.next(res);
      } else {
        this.countryData = [];
        this.countryData_.next([]);
      }
    }
  }

  afterRefreshTokenCallApi(request) {
    // const params = new HttpParams()
    if (request.method == 'GET')
      return this.httpClient.get(request.urlWithParams);
    // else if (request.method == 'POST')
    // return this.httpClient.post(request.urlWithParams);
  }


  /**
   * Handle HTTP call errors.
   */
  handleError(error: HttpErrorResponse): Observable<any> {
    let message = null;
    // if (error.error instanceof ErrorEvent) {
    //   this.toastrService.error(`An error occurred: ${error.error.message}`);
    // } else {
    //   this.toastrService.error(`Backend returned code: ${error.status}, body was: ${error.error}`);
    // }
    // return throwError(this.toastrService.error('Something bad happened. Please try again later.'));
    return throwError(null);
  }





}


