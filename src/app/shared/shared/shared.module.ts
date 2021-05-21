import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DeleteConfirmComponent } from './delete-confirm/delete-confirm.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { AddNameComponent } from './add-name/add-name.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DeleteConfirmComponent, AddNameComponent],
  imports: [CommonModule, MatSidenavModule, MatButtonModule, FormsModule, ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,],
  // entryComponents: [DeleteConfirmComponent],
  exports: [DeleteConfirmComponent, AddNameComponent]
})
export class SharedModule { }
