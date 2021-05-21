import { ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import {
  Component,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AttributeGeneralCategories,
  AttributeGeneralModes,
} from 'src/app/core/enums/roles.enum';
import { Attribute, AttributeGeneral } from 'src/app/core/model/attribute';
import { AssetsService } from 'src/app/core/services/assets.service';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-form-general',
  templateUrl: './form-general.component.html',
  styleUrls: ['./form-general.component.scss'],
})
export class EquipmentFormComponent implements AfterViewInit, OnInit {
  generalForm: FormGroup;
  attributeData: Attribute;
  assetsData: Attribute;
  categories = AttributeGeneralCategories;
  generalModes = AttributeGeneralModes;
  selectedValue: string;
  separatorKeysCodes: number[] = [ENTER];
  isAssets = false;
  isTemp = false;
  TempName: string;
  AssetName: string;
  TempId: string;
  AssetId: string;
  isTempHeader: string;
  isAssetHeader: string;
  cloneGeneralData: any;

  constructor(
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private attributeService: AttributeService,
    private assetService: AssetsService,
    private router: Router
  ) {
    this.isAssets = this.router.url.includes('/assets/');
    this.isTemp = this.router.url.includes('/equipment/');
    this.generalForm = this.formBuilder.group({
      id: [''],
      equipmentName: [''],
      description: [''],
      category: [[]],
      fromDate: [''],
      toDate: [''],
      manufacturer: [''],
      modes: [[]],
      functionalGroup: [''],
      manual: [''],
    });
    if (this.isTemp) {
      this.TempName = "Equipment Template Name";
      this.TempId = "Equipment Template ID";
      this.isTempHeader = "Equipment";
      this.attributeService.attributeData.subscribe(
        (res) => {
          if (res) {
            this.attributeData = res;
            this.cloneGeneralData = JSON.stringify(res);
            // this.attributeData = this.goclone(res);
            this.dataBind(res);
          }
        },
        (err) => {
          this.toastService.errorMsg(err);
          this.attributeData = new Attribute();
        }
      );
    } else if (this.isAssets) {
      this.AssetName = "Asset Name";
      this.AssetId = "Asset ID";
      this.isAssetHeader = "Assets";
      this.assetService.assetsData.subscribe(
        (res) => {
          if (res) {
            this.cloneGeneralData = JSON.stringify(res);
            this.assetsData = res;
            this.dataBind(res);
          }
        },
        (err) => {
          this.toastService.errorMsg(err);
          this.assetsData = new Attribute();
        }
      );
    }
  }

  goclone(source) {
    if (Object.prototype.toString.call(source) === '[object Array]') {
      var clone = [];
      for (var i = 0; i < source.length; i++) {
        clone[i] = this.goclone(source[i]);
      }
      return clone;
    } else if (typeof source == 'object') {
      var clone1 = {};
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          clone1[prop] = this.goclone(source[prop]);
        }
      }
      return clone1;
    } else {
      return source;
    }
  }

  ngAfterViewInit(): void { }
  ngOnInit(): void { }
  submitForm() {
    if (this.generalForm.invalid) {
      for (const i in this.generalForm.controls) {
        this.generalForm.controls[i].markAsDirty();
        this.generalForm.controls[i].updateValueAndValidity();
      }
      return;
    }
    let general = new AttributeGeneral();
    general.categories = this.val.category.value;
    general.description = this.val.description.value;
    general.functionalGroup = this.val.functionalGroup.value;
    general.manual = this.val.manual.value;
    general.manufacturer = this.val.manufacturer.value;
    general.modes = this.val.modes.value;
    general.validity.from = this.val.fromDate.value;
    general.validity.to = this.val.toDate.value;
    if (this.isTemp) {
      general.status = this.attributeData.general.status;
      this.attributeData.name = this.val.equipmentName.value;
      this.attributeData.general = general;
      this.attributeService
        .saveAttruibuteById(this.attributeData.id, { name: this.val.equipmentName.value, general: general })
        .subscribe(
          (res) => {
            this.attributeService.attributeData.next(res['data']);
            this.attributeService.updateAllAttributeData(res['data']);
            this.toastService.savedataMsg(res['message']);
          },
          (err) => {
            this.toastService.errorMsg(err);
          }
        );
    } else if (this.isAssets) {
      this.assetsData.general = general;
      this.assetService
        .saveAssetsById(this.assetsData.id, { assetName: this.val.equipmentName.value, general: general })
        .subscribe(
          (res) => {
            this.assetService.assetsData.next(res['data']);
            this.assetService.updateAllAssetsData(res['data']);
            this.toastService.savedataMsg(res['message']);
          },
          (err) => {
            this.toastService.errorMsg(err);
          }
        );
    }
  }
  get val() {
    return this.generalForm.controls;
  }

  dataBind(res: Attribute) {
    if (res.id) {
      this.generalForm.patchValue({ id: res.id });
    }
    if (res.general && res.id) {
      this.generalForm.patchValue({
        id: res.id ? res.id : '',
        equipmentName: this.isTemp ? res.name : res['assetName'],
        description: res.general.description ? res.general.description : '',
        category: res.general.categories ? res.general.categories : [],
        functionalGroup: res.general.functionalGroup ? res.general.functionalGroup : '',
        manual: res.general.manual ? res.general.manual : '',
        manufacturer: res.general.manufacturer ? res.general.manufacturer : '',
        modes: res.general.modes ? res.general.modes : [],
        fromDate: res.general.validity.from ? new Date(res.general.validity.from) : null,
        toDate: res.general.validity.to ? new Date(res.general.validity.to) : null,
      });
      //
    }
  }
  resetForm() {
    if (this.isTemp) {
      this.dataBind(JSON.parse(this.cloneGeneralData))
    } else if (this.isAssets) {
      this.dataBind(JSON.parse(this.cloneGeneralData))
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

  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
}
