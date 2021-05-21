import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Attribute } from 'src/app/core/model/attribute';
import { ApiResponse } from 'src/app/core/model/user-login';
import { AttributeService } from 'src/app/core/services/attribute.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-equipment-form',
  templateUrl: './equipment-form.component.html',
  styleUrls: ['./equipment-form.component.scss'],
})
export class EquipmentFormComponent implements OnInit {
  name: string;
  id: string;
  data: Attribute;

  constructor(private toastService: ToastService,
    private route: ActivatedRoute,
    private attributeService: AttributeService,
    private ref: ChangeDetectorRef,
    private router: Router) {
    this.route.paramMap.subscribe(paramMap => {
      this.id = paramMap.get('id');
      this.name = paramMap.get('name');
      if (this.id) {
        this.getData(this.id);
      }
    });

    this.attributeService.attributeData.subscribe(res => {
      if (res) {
        this.data = res;
      }
    });

  }

  ngOnInit(): void {

  }

  getData(id) {
    this.attributeService.getAttruibuteById(id).subscribe((res: ApiResponse | Attribute | any) => {
      if (res && res.data) {
        console.log(res,"....res");

        this.name = res.data.name;
        this.attributeService.attributeData.next(res.data);
      } else if (res) {
        this.name = res.name;
      }
    }, err => {
      this.toastService.errorMsg(err);
    })
  }
}
