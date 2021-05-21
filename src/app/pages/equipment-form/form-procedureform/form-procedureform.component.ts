import { ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Attribute, SOP } from 'src/app/core/model/attribute';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { AttributeGeneralCategories, AttributeTools } from 'src/app/core/enums/roles.enum';
import { AssetsService } from 'src/app/core/services/assets.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-form-procedureform',
  templateUrl: './form-procedureform.component.html',
  styleUrls: ['./form-procedureform.component.scss'],
})
export class FormProcedureFormComponent implements OnInit {
  sopForm: any;
  attributeData: Attribute = new Attribute();
  assetsData: Attribute = new Attribute();

  formData: SOP;
  subs: Subscription = new Subscription();
  id: any;
  Categories = AttributeGeneralCategories;
  Tools = AttributeTools;
  tagIndex = 0;
  readonly separatorKeysCodes: number[] = [ENTER];
  isAssets = false;
  isTemp = false;
  checkNewProcedureRes: any;
  cloneProcedureData: any;
  isProcedureSubmitted = false;

  constructor(private route: ActivatedRoute,
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private attributeService: AttributeService,
    private _location: Location,
    public router: Router,
    private assetService: AssetsService) {
    this.isAssets = this.router.url.includes('/assets/');
    this.isTemp = this.router.url.includes('/equipment/');
    this.sopForm = this.formBuilder.group({
      id: [''],
      category: [[], [Validators.required]],
      details: [''],
      effort: [''],
      equipmentSection: [[]],
      manual: [''],
      notes: [''],
      photo: [''],
      procedure: ['', [Validators.required]],
      tools: [[]],
      video: [''],
    });
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.isTemp) {
        this.subs.add(
          this.attributeService.attributeData.subscribe(res => {
            this.attributeData = res;
            if (res && res.procedures && res.procedures.sop) {
              this.formData = res.procedures.sop.filter((el, i) => {
                if (el.id == this.id) {
                  this.tagIndex = i;
                  return el;
                }
              })[0];
              this.cloneProcedureData = JSON.stringify(this.attributeData.procedures.sop[this.tagIndex]);
              this.dataBind(this.formData);
            }
          }, err => {
            this.attributeData = new Attribute();
            this.attributeData.procedures = { sop: [] };
            this.toastService.errorMsg(err);
          })
        )
      } else if (this.isAssets) {
        this.subs.add(
          this.assetService.assetsData.subscribe(res => {
            this.assetsData = res;
            if (res && res.procedures && res.procedures.sop) {
              this.formData = res.procedures.sop.filter((el, i) => {
                if (el.id == this.id) {
                  this.tagIndex = i;
                  return el;
                }
              })[0];
              this.cloneProcedureData = JSON.stringify(this.assetsData.procedures.sop[this.tagIndex]);
              this.dataBind(this.formData);
            }
          }, err => {
            this.assetsData = new Attribute();
            this.assetsData.procedures = { sop: [] };
            this.toastService.errorMsg(err);
          })
        )
      }
    })
  }

  ngOnInit(): void { }

  submitForm() {
    this.isProcedureSubmitted = true;
    let duplicateArray = [];
    if (this.sopForm.invalid) {
      for (const i in this.sopForm.controls) {
        this.sopForm.controls[i].markAsDirty();
        this.sopForm.controls[i].updateValueAndValidity();
      }
      return;
    }

    if (this.isTemp && this.attributeData && this.attributeData.procedures && this.attributeData.procedures.sop) {
      duplicateArray = [];
      duplicateArray = this.attributeData.procedures.sop.filter((res) => {
        return res.procedure == this.val.procedure.value && this.tagIndex == 0;
      });
    }
    else if (this.isAssets && this.assetsData && this.assetsData.procedures && this.assetsData.procedures.sop) {
      duplicateArray = [];
      duplicateArray = this.assetsData.procedures.sop.filter((res) => {
        return res.procedure == this.val.procedure.value && this.tagIndex == 0;
      });
    }
    if (duplicateArray && duplicateArray.length > 0) {
      let message = "Procedure Name is already exist."
      this.toastService.infoMsg(message, '');
      return;
    }


    let sop = new SOP();
    sop.id = this.getTagId();
    sop.category = this.val.category.value;
    sop.details = this.val.details.value;
    sop.effort = this.val.effort.value;
    sop.equipmentSection = this.val.equipmentSection.value;
    sop.manual = this.val.manual.value;
    sop.notes = this.val.notes.value;
    sop.photo = this.val.photo.value;
    sop.procedure = this.val.procedure.value;
    sop.tools = this.val.tools.value;
    sop.video = this.val.video.value;
    if (this.isTemp) {
      if (this.router.url.includes('procedures/add')) {
        if (this.attributeData.procedures) { if (this.attributeData.procedures.sop) { this.attributeData.procedures.sop.push(sop); } else { this.attributeData.procedures['sop'] = [sop] } } else { this.attributeData['procedures'] = { sop: [sop] } }
      }
      else {
        this.attributeData.procedures.sop[this.tagIndex] = sop;
      }
    }
    else if (this.isAssets) {
      if (this.router.url.includes('procedures/add')) {
        if (this.assetsData.procedures) { if (this.assetsData.procedures.sop) { this.assetsData.procedures.sop.push(sop); } else { this.assetsData.procedures['sop'] = [sop] } } else { this.assetsData['procedures'] = { sop: [sop] } }
      }
      else {
        this.assetsData.procedures.sop[this.tagIndex] = sop;
      }
    }

    if (this.isTemp) {
      this.attributeService.saveAttruibuteById(this.attributeData.id, { procedures: this.attributeData.procedures }).subscribe(res => {
        this.attributeService.attributeData.next(res['data']);
        this.attributeService.updateAllAttributeData(res['data']);
        this.toastService.savedataMsg(res['message']);
        this.backClicked();
      }, err => {
        this.toastService.errorMsg(err);
      });
    }
    else if (this.isAssets) {
      this.assetService.saveAssetsById(this.assetsData.id, { procedures: this.assetsData.procedures }).subscribe(res => {
        this.assetService.assetsData.next(res['data']);
        this.assetService.updateAllAssetsData(res['data']);
        this.toastService.savedataMsg(res['message']);
        this.backClicked();
      }, err => {
        this.toastService.errorMsg(err);
      });
    }
  }
  get val() {
    return this.sopForm.controls;
  }

  getTagId() {
    if (this.router.url.includes('procedures/add')) {
      return (this.getId()).toString();
    } else {
      if (this.isTemp) {
        return (this.attributeData.procedures.sop[this.tagIndex].id).toString()
      } else if (this.isAssets) {
        return (this.assetsData.procedures.sop[this.tagIndex].id).toString()
      }
    }
    return '1';
  }

  getId() {
    let id = 1;
    try {
      if (this.isTemp) {
        id = Math.max.apply(Math, this.attributeData.procedures.sop.map(function (o) { return +o.id; })) + 1;
      } else if (this.isAssets) {
        id = Math.max.apply(Math, this.assetsData.procedures.sop.map(function (o) { return +o.id; })) + 1;
      }
    } finally {
      return id && id > 0 ? id : 1;
    }
  }

  selectedValue: string;

  backClicked() {
    this._location.back();
  }
  dataBind(res: SOP) {
    this.checkNewProcedureRes = res;
    if (res) {
      this.sopForm.patchValue({
        id: res.id,
        category: res.category ? res.category : [],
        details: res.details ? res.details : '',
        effort: res.effort ? res.effort : '',
        equipmentSection: res.equipmentSection ? res.equipmentSection : [],
        manual: res.manual ? res.manual : '',
        notes: res.notes ? res.notes : '',
        photo: res.photo ? res.photo : '',
        procedure: res.procedure ? res.procedure : '',
        tools: res.tools ? res.tools : [],
        video: res.video ? res.video : ''
      })
    }
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.val.tools.value.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  remove(fruit): void {
    const index = this.val.tools.value.indexOf(fruit);

    if (index >= 0) {
      this.val.tools.value.splice(index, 1);
    }
  }
  selected(event, key): void {
    if (this.val[key].value.indexOf(event) == -1 && event.trim().length > 0) {
      this.val[key].value.push(event);
    }
  }

  onToppingRemoved(topping: string, key) {
    const toppings = this.val[key].value as string[];
    this.removeFirst(toppings, topping);
    this.val[key].setValue(toppings); // To trigger change detection
  }
  resetForm() {
    if (this.checkNewProcedureRes) {
      if (this.isTemp) {
        // this.dataBind(this.attributeData.procedures.sop[this.tagIndex]);
        this.dataBind(JSON.parse(this.cloneProcedureData))
      } else if (this.isAssets) {
        this.dataBind(JSON.parse(this.cloneProcedureData))
        // this.dataBind(this.assetsData.procedures.sop[this.tagIndex]);
      }
    }
  }
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
