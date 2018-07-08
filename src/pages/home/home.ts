import { Component } from '@angular/core';
import {NavController, App, AlertController, ToastController} from "ionic-angular";
import {LoginPage} from "../login/login";
import {ActivityPage} from "../activity/activity";
import {ContactPage} from "../contact/contact";
import {ScanPage} from "../scan/scan";
import {ProfilePage} from "../profile/profile";
import {RestProvider} from "../../providers/rest/rest";
import { Storage } from '@ionic/storage';
import {identity} from "rxjs/util/identity";
import {ImpressumPage} from "../impressum/impressum";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        public app: App,
        private storage: Storage,
        public restProvider: RestProvider) {
    }

    /**
     * Funktionen zur Navigation von Home zu restlichen Seiten
     */
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
    goToImpressum(){
        this.navCtrl.push(ImpressumPage);
    }



    /**
     * Logout Funktion: logout() startet einen Confirm Alert. Bei Bestätigung des Logouts wird die Funktion performLogout() ausgeführt.
     * Im Anschluß erscheint ein Toast zur Bestätigung des erfolgreichen Logouts, nachdem der Storage geleert wurde.
     */
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
