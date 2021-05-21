import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AssetsLayerPlaceholder, orgStructurePlaceHolder } from 'src/app/core/enums/roles.enum';
export class AddNameModel {
  constructor(public title: string, public message: string, public id: string, public name: string, public type: string, public isEdit: boolean, public modelString: string) {
  }
}

@Component({
  selector: 'app-add-name',
  templateUrl: './add-name.component.html',
  styleUrls: ['./add-name.component.scss']
})
export class AddNameComponent implements OnInit {
  addAssetNameForm: FormGroup;
  title: string;
  message: string;
  id: string;
  name: string;
  type: string;
  isEdit: boolean;
  layerWisePlaceholder: any;
  lastName: any;
  questionText: string;
  model: any
  isSubmitted = false;


  constructor(public dialogRef: MatDialogRef<AddNameComponent>, private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: AddNameModel) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;
    this.id = data.id;
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.layerWisePlaceholder = '';
    if (this.data.modelString == "Assets") {
      if (this.data && this.data.type == 'addLayer1')
        this.layerWisePlaceholder = AssetsLayerPlaceholder["layer1Placeholder"];
      else if (this.data && this.data.type == 'addLayer2')
        this.layerWisePlaceholder = AssetsLayerPlaceholder["layer2Placeholder"];
      else if (this.data && this.data.type == 'addLayer3')
        this.layerWisePlaceholder = this.layerWisePlaceholder = AssetsLayerPlaceholder["layer3Placeholder"];
    }
    else if (this.data.modelString == "OrgStructure") {
      if (this.data && this.data.type == 'addLayer1')
        this.layerWisePlaceholder = orgStructurePlaceHolder["layer1Placeholder"];
      else if (this.data && this.data.type == 'addLayer2')
        this.layerWisePlaceholder = orgStructurePlaceHolder["layer2Placeholder"];
    }
    if (this.data.isEdit)
      this.name = this.data.name;

    this.addAssetNameForm = this.formBuilder.group({
      name: ['', [Validators.required]]
    })

  }



  onConfirm(): void {

    this.isSubmitted = true;
    if (this.addAssetNameForm.invalid) {
      for (const i in this.addAssetNameForm.controls) {
        this.addAssetNameForm.controls[i].markAsDirty();
        this.addAssetNameForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    if (this.name && this.name.trim().length > 0) {
      // Close the dialog, return true
      this.dialogRef.close({ checked: true, id: this.id, name: this.name });
    }
  }



  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close({ checked: false, id: this.id, name: this.name });
  }
}
