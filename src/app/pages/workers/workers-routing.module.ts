import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkersFormComponent } from './workers-form/workers-form.component';
import { WorkersListComponent } from './workers-list/workers-list.component';

const routes: Routes = [
  { path: '', component: WorkersListComponent },
  {
    path: ':id',
    component: WorkersFormComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('../workers-form/workers-form.module').then(
            (mod) => mod.WorkersFormModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkersRoutingModule { }
