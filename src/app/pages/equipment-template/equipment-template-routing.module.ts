import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { EquipmentListComponent } from './equipment-list/equipment-list.component';

const routes: Routes = [
  { path: '', component: EquipmentListComponent },
  // { path: 'add/:name', component: EquipmentFormComponent, children: [
  //   { path: '', loadChildren: () => import('../equipment-form/equipment-form.module').then(mod => mod.EquipmentFormModule) },
  //   ]
  // },
  { path: 'edit/:id', component: EquipmentFormComponent, children: [
    { path: '', loadChildren: () => import('../equipment-form/equipment-form.module').then(mod => mod.EquipmentFormModule) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EquipmentTemplateRoutingModule {}
