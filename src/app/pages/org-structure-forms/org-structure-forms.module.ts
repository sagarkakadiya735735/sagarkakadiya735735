import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrgStructureFormsRoutingModule } from './org-structure-forms-routing.module';
import { PositionFormComponent } from './position-form/position-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [PositionFormComponent],
  imports: [
    CommonModule,
    OrgStructureFormsRoutingModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ]
})
export class OrgStructureFormsModule { }
