import { Component, HostListener, Inject, OnInit, ViewChildren } from '@angular/core';
import { UserLogin } from 'src/app/core/model/user-login';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { HttpResponse } from '@angular/common/http';
import { ToastService } from 'src/app/core/services/toast.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import {  } from 'src/app/pages/equipment-template/equipment-list/equipment-list.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  userLogin: UserLogin = new UserLogin();
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private toastService: ToastService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (localStorage.getItem(environment.dataKey)) {
      this.route.navigate(['']);
    }
    this.loginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  submitForm() {
    this.isLoading = true;
    if (this.authService.requestedUrl == "/login")
      this.authService.requestedUrl = '';
    if (this.loginForm.invalid) {
      for (const i in this.loginForm.controls) {
        this.loginForm.controls[i].markAsDirty();
        this.loginForm.controls[i].updateValueAndValidity();
      }
      this.isLoading = false;
      return;
    }
    let model: UserLogin = new UserLogin();
    model.userName = this.val.Email.value;
    model.password = this.val.Password.value;
    this.authService.login(model).subscribe((res: HttpResponse<any>) => {
      if (res) {
        console.log(res);
        
        console.log(this.authService.getDecodedAccessToken(res['token']));
        
        let decodedData = this.authService.getDecodedAccessToken(res['token'])
        if (!!decodedData.status && decodedData.status != "ACTIVE") {
          this.openDialog();
          return;
        }
        localStorage.setItem(environment.dataKey, btoa(JSON.stringify({ data: decodedData, token: res['token'] })));
        if (this.authService.requestedUrl) {
          this.route.navigate([this.authService.requestedUrl]);
        } else {
          this.route.navigate(['']);
        }
        this.isLoading = false;
        this.loginForm.reset();
      }
    }, err => {
    })
  }

  get val() {
    return this.loginForm.controls;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ExpireDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      // if(result) { this.router.navigate(['equipment/add', result]); }
    });
  }
}


@Component({
  selector: 'app-dialog',
  template: `<div class="d-flex justify-content-between align-items-start"><h1 mat-dialog-title>Error</h1><div class="close" (click)="onNoClick()" style="cursor: pointer; padding-top: 3px"><span class="material-icons"> close </span></div></div>
  <div mat-dialog-content style="overflow:hidden;">
    <div class="Equipment-form wquipment-popup w-100" style="color: #e60c2e; font-weight: 500; font-size: 16px">
      Your subscription has expired, please contact your system administrator.
    </div>
  </div>
  <div mat-dialog-actions class="d-flex justify-content-end"></div>`
})
export class ExpireDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ExpireDialogComponent>) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onOkClick() {

  }

  @HostListener("keydown.esc")
  public onEsc() {
    this.dialogRef.close();
  }

}
