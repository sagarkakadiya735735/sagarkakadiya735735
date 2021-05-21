import { ToastService } from 'src/app/core/services/toast.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { BehaviorSubject, observable, Observable, of } from 'rxjs';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, filter, retry, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { CommonService } from '../services/common.service';
import { Router } from '@angular/router';
import { AssetsService } from '../services/assets.service';


@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  req: any;
  next: any;
  constructor(private authService: AuthService, private router: Router, private assetsService: AssetsService,
    private commonService: CommonService, private httpClient: HttpClient, private toastService: ToastService) { }
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addHeader(request, next);
    return next.handle(request).pipe(retry(1), catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            if (this.refreshTokenSubject.value == null)
              request = this.addHeader(request, next);
            return this.authService.refreshToken().pipe(
              switchMap((res: any) => {
                this.isRefreshing = false;
                if (res && res.token) {
                  localStorage.setItem(environment.dataKey, btoa(JSON.stringify({ data: this.authService.getDecodedAccessToken(res['token']), token: res['token'] })))
                  return next.handle(this.addHeader(request, next));
                }
                this.refreshTokenSubject.next(res['token']);
              }));
          } else {
            return this.refreshTokenSubject.pipe(
              filter(token => (token != null && token != undefined)),
              take(1),
              switchMap(() => {
                return next.handle(this.addHeader(request, next))

              }));
          }
        }
        else if (error.status === 403) {
          this.toastService.errorMsg(error);
          this.authService.logout();
          return of(error.error)
        }
        else if (error.status === 404) {
          if (!this.assetsService.assetsHierarchy.value || this.assetsService.assetsHierarchy.value.floc.length == 0) {
            this.toastService.errorMsg(error);
          }
          return of(error.error)
        }
      }
    }));
  }


  private addHeader(request: HttpRequest<any>, next: HttpHandler) {
    let headers = request.headers;
    let getEndPoint = request.url.split('/')[request.url.split('/').length - 1];
    const accessToken = localStorage.getItem(environment.dataKey);
    const data = accessToken ? JSON.parse(atob(accessToken)) : '';
    let clonedRequest = request.clone();
    if (getEndPoint && accessToken) {
      if (data && data.token) {
        request = request.clone({ setHeaders: { Authorization: `Bearer ${data.token}` } });
      }
    }
    if (this.req && request && this.req.urlWithParams != request.urlWithParams) {
      clonedRequest = request.clone({ headers });
    }
    if (data && data.data.exp < (new Date()).getTime() / 1000 && !request.url.includes('user/refreshtoken') && !request.url.includes('/user/authenticate')) {
      this.req = clonedRequest;
      this.next = next;
    }

    if (request.headers['lazyUpdate'] && request.headers['lazyUpdate'].length > 1) {
      request.headers['lazyUpdate'].shift();
      return request
    }
    else
      return request;
  }
}
