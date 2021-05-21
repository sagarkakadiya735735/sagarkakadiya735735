import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent, EquipmentListComponent } from './equipment-list/equipment-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EquipmentTemplateRoutingModule } from './equipment-template-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { EquipmentFormComponent } from './equipment-form/equipment-form.component';
import { MatSortModule } from '@angular/material/sort';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [EquipmentListComponent, EquipmentFormComponent, DialogComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    EquipmentTemplateRoutingModule,
    ScrollingModule
  ],
})
export class EquipmentTemplateModule { }
