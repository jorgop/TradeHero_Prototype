import { Component } from '@angular/core';
import {NavController, App, AlertController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {ActivityPage} from "../activity/activity";
import {AboutPage} from "../about/about";
import {ContactPage} from "../contact/contact";
import {ScanPage} from "../scan/scan";
import {ProfilePage} from "../profile/profile";
import {RestProvider} from "../../providers/rest/rest";
import { Storage } from '@ionic/storage';
import {identity} from "rxjs/util/identity";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public app: App,
        private storage: Storage,
        public restProvider: RestProvider) {
    }


    goToScan(){
        this.navCtrl.push(ScanPage);
    }
    goToProfile(){
        this.navCtrl.push(ProfilePage);
    }
    goToContact(){
        this.navCtrl.push(ContactPage);
    }
    goToActivity(){
        this.navCtrl.push(ActivityPage);
    }
    goToHome(){
        this.navCtrl.push(HomePage);
    }
    goToAbout(){
        this.navCtrl.push(AboutPage);
    }

    performLogout() {
        this.navCtrl.setRoot(LoginPage);
        this.navCtrl.popToRoot();
        this.storage.clear();
    }
    logout() {
        const confirm = this.alertCtrl.create({
            title: 'Logout bestätigen',
            buttons: [
                {
                    text: 'Abbrechen',
                    handler: () => {
                        console.log('Logout abgebrochen');
                    }
                },
                {
                    text: 'Logout',
                    handler: () => {
                        console.log('Logout erfolgreich');
                        this.performLogout();
                    }
                }
            ]
        });
        confirm.present();
    }

  /**
   * set data form rest to local storage - not used
   */
  addDataToLocalStorage(){

    this.storage.get('identity').then((val) => {
      let identity = <any>{};
      identity = JSON.parse(val);
      console.log(identity);

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
