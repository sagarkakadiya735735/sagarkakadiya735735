import { OrgStructureFormsRoutingModule } from './../org-structure-forms/org-structure-forms-routing.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionFormComponent } from '../org-structure-forms/position-form/position-form.component';
import { orgStructureListComponent } from './orgStructure-list/orgStructure-list.component';

const routes: Routes = [
  { path: '', component: orgStructureListComponent },
  {
    path: ':id', component: orgStructureListComponent, children: [
      { path: '', loadChildren: () => import('../org-structure-forms/org-structure-forms.module').then(mod => mod.OrgStructureFormsModule) },
    ]
  }
  // {
  //   path: ':id',
  //   component: orgStructureListComponent,
  //   children: [
  //     { path: '', loadChildren: () => import("../org-structure/orgStructure.module").then(module => module.orgStructureModule) }
  //   ]
  // }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class orgstructureRoutingModule { }
