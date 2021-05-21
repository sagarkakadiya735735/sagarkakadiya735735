import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { SopsPermitsComponent } from './sops-permits/sops-permits.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile-details' },
  { path: 'profile-details', component: ProfileDetailsComponent },
  { path: 'sops-permits', component: SopsPermitsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkersFormRoutingModule {}
