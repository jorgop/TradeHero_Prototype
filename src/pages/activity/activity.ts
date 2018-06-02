import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NewActivityPage } from "../new-activity/new-activity";
import {ActivityService} from "../../services/activity.service";

@Component({
    selector: 'page-activity',
    templateUrl: 'activity.html'
})
export class ActivityPage {
    activity: {title: string}[] = [];

    constructor(
        public navCtrl: NavController,
        private activityService: ActivityService) {

    }

    ionViewWillEnter(){
        this.activity = this.activityService.getActivity();
    }

    goToAddActivity(){
        this.navCtrl.push(NewActivityPage);
    }

}
