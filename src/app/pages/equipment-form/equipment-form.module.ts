import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipmentFormComponent } from './form-general/form-general.component';
import { FormAttributeComponent } from './form-attribute/form-attribute.component';
import { EquipmentFormRoutingModule } from './equipment-form-routing.module';
import { MatTableModule } from '@angular/material/table';
import { FormReportsComponent } from './form-reports/form-reports.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormApiComponent } from './form-api/form-api.component';
import { FormProcedureFormComponent } from './form-procedureform/form-procedureform.component';
import { FormLotoComponent } from './form-loto/form-loto.component';
import { FormPpeComponent } from './form-ppe/form-ppe.component';
import { FormAttributesformComponent } from './form-attributesform/form-attributesform.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormProcedureComponent } from './form-procedure/form-procedure.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

@NgModule({
  declarations: [
    EquipmentFormComponent,
    FormAttributeComponent,
    FormReportsComponent,
    FormApiComponent,
    FormProcedureFormComponent,
    FormLotoComponent,
    FormPpeComponent,
    FormAttributesformComponent,
    FormProcedureComponent,
  ],
  imports: [
    CommonModule,
    EquipmentFormRoutingModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSortModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    SharedModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ]
})
export class EquipmentFormModule {}
