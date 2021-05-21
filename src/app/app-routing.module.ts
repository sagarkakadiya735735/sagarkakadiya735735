import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/guard/auth.guard';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // { path: '', redirectTo: '/master', pathMatch: 'full' }, // bypass
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/auth.module').then((mod) => mod.AuthModule),
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (mod) => mod.DashboardModule
          ),
      },
      {
        path: 'equipment',
        loadChildren: () =>
          import('./pages/equipment-template/equipment-template.module').then(
            (mod) => mod.EquipmentTemplateModule
          ),
      },
      {
        path: 'assets',
        loadChildren: () =>
          import('./pages/assets-module/assets.module').then(
            (mod) => mod.AssetsModule
          ),
      },
      {
        path: 'workers',
        loadChildren: () =>
          import('./pages/workers/workers.module').then(
            (mod) => mod.WorkersModule
          ),
      },
      {
        path: 'orgstructure',
        loadChildren: () =>
          import('./pages/org-structure/orgStructure.module').then(
            (mod) => mod.orgStructureModule
          ),
      },
    ],
  },
  // { path: '404', component: NotFoundComponent },
  // { path: '**', redirectTo: '/404', pathMatch: 'full' },
  //   { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
