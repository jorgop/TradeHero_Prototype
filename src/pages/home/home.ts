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
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

  /**
   * @constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {AlertController} alertCtrl Alert Controller
   * @param {ToastController} toastCtrl Toast Message Controller
   * @param {App} app App
   * @param {Storage} storage Local Storage
   * @param {RestProvider} restProvider Provider for Rest-Service
   * @param {NativePageTransitions} pageTransition Options for Native Page Transitions
   */
    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        private toastCtrl: ToastController,
        public app: App,
        private storage: Storage,
        public restProvider: RestProvider,
        private pageTransition: NativePageTransitions) {
    }

    /*leftOptions: NativeTransitionOptions = {
        direction: 'left'
    };
    rightOptions: NativeTransitionOptions = {
        direction: 'right'
    };*/

  /**
   * Navigate to ScanPage
   */
  goToScan(){
      this.navCtrl.push(ScanPage);
  }

  /**
   * Navigate to ProfilePage
   */
  goToProfile(){
        this.navCtrl.push(ProfilePage);
    }

  /**
   * Navigate to ContactPage
   */
  goToContact(){
        this.navCtrl.push(ContactPage);
    }

  /**
   * Navigate to ActivityPage
   */
  goToActivity(){
        this.navCtrl.push(ActivityPage);
    }

  /**
   * Navigate to HomePage
   */
  goToHome(){
        this.navCtrl.push(HomePage);
    }

  /**
   * Navigate to ImpressumPage
   */
  goToImpressum(){
        this.navCtrl.push(ImpressumPage);
    }

  //TODO: set comments. For Example look at the ocrPage!
  swipeEvent(e){
        if (e.direction == 4) {
            let rightOptions: NativeTransitionOptions ={
                direction: 'right',
                duration: 400,
                slowdownfactor: -1,
                iosdelay: 50
            };
            this.pageTransition.slide(rightOptions);
            this.navCtrl.push(ActivityPage);
            console.log('Swipe Right')
        }else if(e.direction == 2){
            let leftOptions: NativeTransitionOptions ={
                direction: 'left',
                duration: 400,
                slowdownfactor: -1,
                iosdelay: 50
            };
            this.pageTransition.slide(leftOptions);
            this.navCtrl.push(ScanPage);
            console.log('Swipe Left')
        }
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
