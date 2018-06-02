import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
import {ActivityService} from "../../services/activity.service";

@Component({
  selector: 'page-new-activity',
  templateUrl: 'new-activity.html',
})
export class NewActivityPage {

    constructor(
        private navCtrl: NavController,
        private activityService: ActivityService) {
    }

    onAddNewActivity(value:{title: string}){
      this.activityService.addActivity(value);
      this.navCtrl.pop();
    }

}
