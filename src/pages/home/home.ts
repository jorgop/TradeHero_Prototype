import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {ActivityPage} from "../activity/activity";
import {ContactPage} from "../contact/contact";
import {ScanPage} from "../scan/scan";
import {ProfilePage} from "../profile/profile";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController) {
    }

    goToActivity(params){
      this.navCtrl.push(ActivityPage);
    }
    goToContact(params){
      this.navCtrl.push(ContactPage)
    }
    goToScann(params){
      this.navCtrl.push(ScanPage)
    }
    goToProfile(params){
      this.navCtrl.push(ProfilePage)
    }
}
