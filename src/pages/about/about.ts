import {Component, ViewChild} from '@angular/core';
import {Storage} from "@ionic/storage";
import {NavController, AlertController, Navbar, ToastController} from 'ionic-angular';
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

  @ViewChild(Navbar) navBar: Navbar;
  constructor(
      public navCtrl: NavController,
      private toastCtrl: ToastController,
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

    ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent)=>{
            this.navCtrl.push(HomePage);
        }
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

}
