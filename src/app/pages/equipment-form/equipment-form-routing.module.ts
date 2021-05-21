import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormApiComponent } from './form-api/form-api.component';
import { FormAttributeComponent } from './form-attribute/form-attribute.component';
import { FormAttributesformComponent } from './form-attributesform/form-attributesform.component';
import { EquipmentFormComponent } from './form-general/form-general.component';
import { FormLotoComponent } from './form-loto/form-loto.component';
import { FormPpeComponent } from './form-ppe/form-ppe.component';
import { FormProcedureComponent } from './form-procedure/form-procedure.component';
import { FormProcedureFormComponent } from './form-procedureform/form-procedureform.component';
import { FormReportsComponent } from './form-reports/form-reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'general' },
  { path: 'general', component: EquipmentFormComponent },
  { path: 'attribute', component: FormAttributeComponent },
  { path: 'reports', component: FormReportsComponent },
  { path: 'api', component: FormApiComponent },
  { path: 'procedures', component: FormProcedureComponent },
  { path: 'procedures/:id', component: FormProcedureFormComponent },
  { path: 'procedures/add', component: FormProcedureFormComponent },
  { path: 'loto', component: FormLotoComponent },
  { path: 'ppe', component: FormPpeComponent },
  { path: 'attributeform', component: FormAttributeComponent },
  { path: 'attributeform/:id', component: FormAttributesformComponent },
  { path: 'attributeform/add', component: FormAttributesformComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentFormRoutingModule {}
