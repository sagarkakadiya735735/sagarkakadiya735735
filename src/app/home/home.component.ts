import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { User } from '../core/model/user';
import { AuthService } from '../core/services/auth.service'
import { AttributeService } from '../core/services/attribute.service'
import { AssetsService } from '../core/services/assets.service';
// import { PrPopDialog } from './pr-pop.component';

@Component({
  selector: 'home-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  userData: User;
  constructor(public dialog: MatDialog, private authService: AuthService, private attributeService: AttributeService, private assetsService: AssetsService) {
    this.userData = JSON.parse(atob(localStorage.getItem(environment.dataKey))).data;
  }
  onLogoutClick() {
    this.authService.logout();
    localStorage.clear();
    this.attributeService.clearAttributeServiceBehaviorSubjectData();
    this.assetsService.clearAssetsBehaviourSubjectData();
  }
  // openDialog() {
  //   this.dialog.open(PrPopDialog);
  // }
}
