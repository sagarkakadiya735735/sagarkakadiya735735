import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toast: ToastrService) { }

  successMsg(title, msg) {
    this.toast.success(msg, title);
  }
  savedataMsg(msg) {
    this.toast.success(msg && msg != '' ? msg : 'Data has been saved successfully');
  }
  errorMsg(err) {
    if (err && err.error && err.error.message && err.error.message.length > 0) {
      this.toast.error(err.error.message[0]);
    }
    // else {
    //   this.toast.error('Something went wrong, Please try again later..');
    // }
  }
  warningMsg(title, msg) {
    this.toast.warning(msg, title);
  }
  infoMsg(title, msg) {
    this.toast.info(msg, title);
  }
  clearMsg(title, msg) {
    this.toast.clear(msg);
  }
}
