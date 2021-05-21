import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsListComponent } from './assets-list/assets-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AssetsRoutingModule } from './assets-routing.module';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { AssetsFormComponent } from './assets-form/assets-form.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [AssetsListComponent, AssetsFormComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    AssetsRoutingModule,
    MatSortModule,
    MatButtonModule,
    MatExpansionModule,
    MatMenuModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class AssetsModule {}
