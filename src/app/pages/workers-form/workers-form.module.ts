import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDetailsComponent } from './profile-details/profile-details.component';
import { WorkersFormRoutingModule } from './workers-form-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { SopsPermitsComponent } from './sops-permits/sops-permits.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { NumberDirective } from 'src/app/core/directive/numbers-only.directive';
import { PhoneMaskDirective } from 'src/app/core/directive/phone-mask.directive';

@NgModule({
  declarations: [ProfileDetailsComponent, SopsPermitsComponent, NumberDirective, PhoneMaskDirective],
  imports: [
    CommonModule,
    MatFormFieldModule,
    WorkersFormRoutingModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
})
export class WorkersFormModule { }
