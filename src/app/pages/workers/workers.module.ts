import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkersFormComponent } from './workers-form/workers-form.component';
import { DialogComponent, WorkersListComponent } from './workers-list/workers-list.component';
import { WorkersRoutingModule } from './workers-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { NumberDirective } from 'src/app/core/directive/numbers-only.directive';

@NgModule({
  declarations: [WorkersFormComponent, WorkersListComponent, DialogComponent],
  imports: [
    CommonModule,
    WorkersRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
  ]
})
export class WorkersModule { }
