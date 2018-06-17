import { Component } from '@angular/core';
import {NavController, NavParams} from "ionic-angular";
import {ActivityPage} from "../activity/activity";
import {ContactPage} from "../contact/contact";
import {ScanPage} from "../scan/scan";
import {ProfilePage} from "../profile/profile";
import {RestProvider} from "../../providers/rest/rest";
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private storage: Storage,
        public restProvider: RestProvider) {
    }

    goToActivity(params){
      this.navCtrl.push(ActivityPage);
    }
    goToContact(params){
      this.navCtrl.push(ContactPage);
    }
    goToScann(params){
      this.navCtrl.push(ScanPage);
    }
    goToProfile(params){
        this.navCtrl.push(ProfilePage);
    }

  /**
   * set data form rest to local storage - not used
   */
  addDataToLocalStorage(){

    this.storage.get('identity').then((val) => {
      let identity = <any>{};
      identity = JSON.parse(val);

      //get user data
      this.restProvider.getUserData(identity['userID']).then((result) => {
        this.storage.set('user',JSON.stringify(result));
      });

      //get activities
      this.restProvider.getActivityData(identity['userID']).then((result) => {
        this.storage.set('strActivities',JSON.stringify(result));
      });
    });
  }

}
