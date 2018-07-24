import { Component } from '@angular/core';
import {AlertController, App, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {ActivityPage} from "../activity/activity";
import {ScanPage} from "../scan/scan";
import {ContactPage} from "../contact/contact";
import { Storage } from '@ionic/storage';
import {LoginPage} from "../login/login";


@Component({
  selector: 'page-impressum',
  templateUrl: 'impressum.html',
})
export class ImpressumPage {

  /**
   * @constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {NavParams} navParams Parameter Controller
   * @param {Storage} storage Local Storage
   * @param {AlertController} alertCtrl Alert Controller
   * @param {ToastController} toastCtrl Toast Message Controller
   * @param {App} app App
   */
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public app: App) {
  }

  /**
   * Navigate to ProfilePage
   */
  goToProfile(){
        this.navCtrl.push(ProfilePage);
    }

  /**
   * Navigate to ActivityPage
   */
  goToActivity(){
        this.navCtrl.push(ActivityPage);
    }

  /**
   * Navigate to ScanPage
   */
  goToScan(){
        this.navCtrl.push(ScanPage);
    }

  /**
   * Navigate to ContactPage
   */
  goToContact(){
        this.navCtrl.push(ContactPage);
    }

  //TODO: set comments. For Example look at the ocrPage!
  logout() {
      const confirm = this.alertCtrl.create({
          title: 'Wollen Sie sich wirklich ausloggen?',
          buttons: [
              {
                  text: 'Abbrechen',
                  handler: () => {
                      console.log('Logout abgebrochen');
                  }
              },
              {
                  text: 'Ausloggen',
                  handler: () => {
                      console.log('Logout erfolgreich');
                      this.performLogout();
                  }
              }
          ]
      });
      confirm.present();
  }

  //TODO: set comments. For Example look at the ocrPage!
  performLogout() {
      this.navCtrl.setRoot(LoginPage);
      this.navCtrl.popToRoot();
      this.storage.clear();
      let logoutConf = this.toastCtrl.create({
          message: 'Sie wurden erfolgreich ausgeloggt',
          duration: 2000,
          position: 'top',
          showCloseButton: true,
          closeButtonText: 'X'
      });
      logoutConf.onDidDismiss(() => {
          console.log('Dismissed toast');
      });
      logoutConf.present();
  }
}
