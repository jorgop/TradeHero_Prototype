import {Component, ViewChild} from '@angular/core';
import {Navbar, NavController, ToastController} from 'ionic-angular';
import {CallNumber} from "@ionic-native/call-number";
import {AlertController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {e, T} from "@angular/core/src/render3";
import {ActivityPage} from "../activity/activity";
import {HomePage} from "../home/home";
import {ProfilePage} from "../profile/profile";
import {ScanPage} from "../scan/scan";
import {LoginPage} from "../login/login";
import {ImpressumPage} from "../impressum/impressum";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

   @ViewChild(Navbar) navBar: Navbar;

  /**
   * @constructor
   * @param {AlertController} Alert Controller
   * @param {ToastController} toastCtrl Toast Message Controller
   * @param {Storage} storage Local Storage
   * @param {CallNumber} callSvc Call Number
   * @param {NavController} navCtrl Navigation Controller
   */
   constructor(
       public alertCtrl: AlertController,
       private toastCtrl: ToastController,
       private storage: Storage,
       private callSvc: CallNumber,
       public navCtrl: NavController) {
   }


  //TODO: set comments. For Example look at the ocrPage!
   startCall(){
       this.callSvc.callNumber("00491719760565",true).then(()=> {
           console.log('number dialed');
       }).catch((err)=>{
           alert(JSON.stringify(err))
       })
   }

    //TODO: set comments. For Example look at the ocrPage!
   callInsurance () {
       const confirm = this.alertCtrl.create({
           title: 'InsuRabbit',
           buttons: [
               {
                   text: 'Abbrechen',
                   handler: () => {
                       console.log('Abbrechen angeklickt');
                   }
               },
               {
                   text: 'Anrufen',
                   handler: () => {
                       console.log('Anrufen angeklickt');
                       this.startCall();
                   }
               }
           ]
       });
       confirm.present();
   }

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

  /**
   * Function will be called if page will be load
   */
  ionViewDidLoad() {
        this.navBar.backButtonClick = (e:UIEvent)=>{
            this.navCtrl.push(HomePage);
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
