import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Attribute, Tag } from 'src/app/core/model/attribute';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AttributeGeneralCategories, AttributeTagModes } from 'src/app/core/enums/roles.enum';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER } from '@angular/cdk/keycodes';
import { AssetsService } from 'src/app/core/services/assets.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-form-attributesform',
  templateUrl: './form-attributesform.component.html',
  styleUrls: ['./form-attributesform.component.scss'],
})
export class FormAttributesformComponent implements OnInit {
  tagForm: any;
  attributeData: Attribute;
  formData: Tag;
  subs: Subscription = new Subscription();
  id: any;
  Tags = AttributeTagModes;
  Categories = AttributeGeneralCategories;
  tagIndex = 0;
  readonly separatorKeysCodes: number[] = [ENTER];
  isAssets = false;
  isTemp = false;
  assetsData: Attribute;
  checkNewAttributeRes: any;
  cloneTagData: any;


  constructor(private route: ActivatedRoute, private toastService: ToastService,
    private formBuilder: FormBuilder, private attributeService: AttributeService, private assetService: AssetsService,
    private _location: Location, public router: Router, private ref: ChangeDetectorRef) {
    this.isAssets = this.router.url.includes('/assets/');
    this.isTemp = this.router.url.includes('/equipment/');
    this.tagForm = this.formBuilder.group({
      id: [''],
      description: [''],
      modes: [[]],
      category: [[]],
      fromDate: [null],
      toDate: [null],
      uom: [''],
      inputType: [''],
      rangeLo: [''],
      rangeHigh: [''],
      rangeLoLo: [''],
      rangeHighHigh: [''],
      hashTags: ['', [Validators.required]],
    });
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      if (this.isTemp) {
        this.subs.add(
          this.attributeService.attributeData.subscribe(res => {
            if (res) {
              this.attributeData = res;
              if (res.attributes && res.attributes.tags) {
                this.formData = res.attributes.tags.filter((el, i) => {
                  if (el.id == this.id) { this.tagIndex = i; return el; }
                })[0];

                this.cloneTagData = JSON.stringify(this.attributeData.attributes.tags[this.tagIndex]);
                this.dataBind(this.formData);
              }
            }
          }, err => {
            this.attributeData = new Attribute();
            this.toastService.errorMsg(err);
          })
        )
      } else if (this.isAssets) {
        this.subs.add(
          this.assetService.assetsData.subscribe(res => {
            if (res) {
              this.assetsData = res;
              if (res.attributes && res.attributes.tags) {
                this.formData = res.attributes.tags.filter((el, i) => {
                  if (el.id == this.id) { this.tagIndex = i; return el; }
                })[0];
                this.cloneTagData = JSON.stringify(this.assetsData.attributes.tags[this.tagIndex]);
                this.dataBind(this.formData);
              }
            }
          }, err => {
            this.assetsData = new Attribute();
            this.toastService.errorMsg(err);
          })
        )
      }
    })
  }


  ngOnInit(): void {
  }

  submitForm() {

    if (this.tagForm.invalid) {
      for (const i in this.tagForm.controls) {
        this.tagForm.controls[i].markAsDirty();
        this.tagForm.controls[i].updateValueAndValidity();
      }
      this.toastService.infoMsg("Tag Name Is Required", '')
      return;
    }
    let tag = new Tag();
    tag.id = this.getTagId();
    tag.categories = this.val.category.value;
    tag.description = this.val.description.value;
    tag.inputType = this.val.inputType.value;
    tag.modes = this.val.modes.value;
    tag.range.lo = this.val.rangeLo.value;
    tag.range.lolo = this.val.rangeLoLo.value;
    tag.range.high = this.val.rangeHigh.value;
    tag.range.highhigh = this.val.rangeHighHigh.value;
    tag.modes = this.val.modes.value;
    tag.validity.from = this.val.fromDate.value;
    tag.validity.to = this.val.toDate.value;
    tag.tag = this.val.hashTags.value;
    tag.uom = this.val.uom.value;

    if (this.isTemp) {
      if (this.router.url.includes('attributeform/add')) {
        if (this.attributeData.attributes) { if (this.attributeData.attributes.tags) { this.attributeData.attributes.tags.push(tag); } else { this.attributeData.attributes['tags'] = [tag] } } else { this.attributeData['attributes'] = { tags: [tag] } }
      } else {
        this.attributeData.attributes.tags[this.tagIndex] = tag;
      }
      this.attributeService.saveAttruibuteById(this.attributeData.id, { attributes: this.attributeData.attributes }).subscribe(res => {
        this.attributeService.attributeData.next(res['data']);
        this.attributeService.updateAllAttributeData(res['data']);
        this.toastService.savedataMsg(res['message']);
        this.backClicked();
      }, err => { this.toastService.errorMsg(err); });
    } else if (this.isAssets) {
      if (this.router.url.includes('attributeform/add')) {
        if (this.assetsData.attributes) { if (this.assetsData.attributes.tags) { this.assetsData.attributes.tags.push(tag); } else { this.assetsData.attributes['tags'] = [tag] } } else { this.assetsData['attributes'] = { tags: [tag] } }
      } else {
        this.assetsData.attributes.tags[this.tagIndex] = tag;
      }
      this.assetService.saveAssetsById(this.assetsData.id, { attributes: this.assetsData.attributes }).subscribe(res => {
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
    return this.tagForm.controls;
  }

  getTagId() {
    if (this.router.url.includes('attributeform/add')) {
      return (this.getId()).toString();
    } else {
      if (this.isTemp) {
        return (this.attributeData.attributes.tags[this.tagIndex].id).toString()
      } else if (this.isAssets) {
        return (this.assetsData.attributes.tags[this.tagIndex].id).toString()
      }
    }
    return '1';
  }

  getId() {
    let id = 1;
    try {
      if (this.isTemp) {
        id = Math.max.apply(Math, this.attributeData.attributes.tags.map(function (o) { return +o.id; })) + 1;
      } else if (this.isAssets) {
        id = Math.max.apply(Math, this.assetsData.attributes.tags.map(function (o) { return +o.id; })) + 1;
      }
    } finally {
      return id && id > 0 ? id : 1;
    }
  }

  selectedValue: string;

  backClicked() {
    this._location.back();
  }

  dataBind(res: Tag) {
    this.checkNewAttributeRes = res;
    if (res) {
      this.tagForm.patchValue({
        id: res.id,
        description: res.description ? res.description : '',
        modes: res.modes ? res.modes : [],
        category: res.categories ? res.categories : [],
        fromDate: res.validity.from ? new Date(res.validity.from) : '',
        toDate: res.validity.to ? new Date(res.validity.to) : '',
        uom: res.uom ? res.uom : '',
        inputType: res.inputType ? res.inputType : '',
        rangeLo: res.range.lo ? res.range.lo : '',
        rangeLoLo: res.range.lolo ? res.range.lolo : '',
        rangeHigh: res.range.high ? res.range.high : '',
        rangeHighHigh: res.range.highhigh ? res.range.highhigh : '',
        hashTags: res.tag ? res.tag : '',
      })
    }
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.val.hashTags.value.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
  }

  remove(fruit): void {
    const index = this.val.hashTags.value.indexOf(fruit);

    if (index >= 0) {
      this.val.hashTags.value.splice(index, 1);
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
    if (this.checkNewAttributeRes) {
      if (this.isTemp) {
        this.dataBind(JSON.parse(this.cloneTagData));
      } else if (this.isAssets) {
        this.dataBind(JSON.parse(this.cloneTagData));
        // this.dataBind(this.assetsData.attributes.tags[this.tagIndex]);
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
