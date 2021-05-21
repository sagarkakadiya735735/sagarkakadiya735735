import { PositionFormComponent } from './position-form/position-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'position-details' },
  { path: 'position-details', component: PositionFormComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrgStructureFormsRoutingModule { }
