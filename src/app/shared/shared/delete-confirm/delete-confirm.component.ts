import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
export class ConfirmDialogModel {
 
  constructor(public title: string, public message: string, public id: number) {
  }
}

@Component({
  selector: 'app-delete-confirm',
  templateUrl: './delete-confirm.component.html',
  styleUrls: ['./delete-confirm.component.scss']
})
export class DeleteConfirmComponent {
  title: string;
  message: string;
  id: number;
 
  constructor(public dialogRef: MatDialogRef<DeleteConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogModel) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.id = data.id;
  }

  onConfirm(): void {
    // Close the dialog, return true
    this.dialogRef.close({checked: true, id: this.id});
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({checked: false, id: this.id});
  }
}
