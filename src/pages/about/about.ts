import { Component } from '@angular/core';
import {Storage} from "@ionic/storage";
import { NavController, AlertController } from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {HomePage} from "../home/home";
import {ContactPage} from "../contact/contact";
import {ActivityPage} from "../activity/activity";
import {ScanPage} from "../scan/scan";
import {LoginPage} from "../login/login";
import {CallNumber} from "@ionic-native/call-number";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      private storage: Storage){

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

}
