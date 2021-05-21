import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-api',
  templateUrl: './form-api.component.html',
  styleUrls: ['./form-api.component.scss'],
})
export class FormApiComponent implements OnInit {
  loginForm: any;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', [Validators.required, Validators.minLength(3)]],
      select: [''],
    });
  }

  submitForm() {}
  get val() {
    return this.loginForm.controls;
  }
}
