import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetsFormComponent } from './assets-form/assets-form.component';
// import { AssetsListComponent } from './assets-list/assets-list.component';

const routes: Routes = [
  { path: '', component: AssetsFormComponent },
  { path: ':id', component: AssetsFormComponent, children: [
      { path: '', loadChildren: () => import('../equipment-form/equipment-form.module').then(mod => mod.EquipmentFormModule) },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsRoutingModule {}
