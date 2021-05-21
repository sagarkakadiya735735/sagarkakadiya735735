import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { orgStructureListComponent } from './orgStructure-list/orgStructure-list.component';
import { orgstructureRoutingModule } from './orgStructure-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { OrgStructureFormComponent } from './org-structure-form/org-structure-form.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [orgStructureListComponent, OrgStructureFormComponent],
  imports: [
    CommonModule,
    orgstructureRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatExpansionModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    ReactiveFormsModule,
  ],
})
export class orgStructureModule { }
