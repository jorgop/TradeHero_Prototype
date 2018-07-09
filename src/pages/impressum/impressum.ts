import { Component } from '@angular/core';
import {AlertController, App, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ProfilePage} from "../profile/profile";
import {ActivityPage} from "../activity/activity";
import {ScanPage} from "../scan/scan";
import {ContactPage} from "../contact/contact";
import { Storage } from '@ionic/storage';
import {LoginPage} from "../login/login";
import {RestProvider} from "../../providers/rest/rest";



/**
 * Generated class for the ImpressumPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-impressum',
  templateUrl: 'impressum.html',
})
export class ImpressumPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public app: App,
              public restProvider: RestProvider) {
  }

    goToProfile(){
        this.navCtrl.push(ProfilePage);
    }
    goToActivity(){
        this.navCtrl.push(ActivityPage);
    }

    goToScan(){
        this.navCtrl.push(ScanPage);
    }

    goToContact(){
        this.navCtrl.push(ContactPage);
    }







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

/**
 * Logout Funktion: logout() startet einen Confirm Alert. Bei Bestätigung des Logouts wird die Funktion performLogout() ausgeführt.
 * Im Anschluß erscheint ein Toast zur Bestätigung des erfolgreichen Logouts, nachdem der Storage geleert wurde.
 */
