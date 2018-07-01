import {Component, ViewChild} from '@angular/core';
import {Navbar, NavController} from 'ionic-angular';
import {CallNumber} from "@ionic-native/call-number";
import {AlertController} from 'ionic-angular';
import {Storage} from "@ionic/storage";
import {e} from "@angular/core/src/render3";
import {ActivityPage} from "../activity/activity";
import {HomePage} from "../home/home";
import {ProfilePage} from "../profile/profile";
import {ScanPage} from "../scan/scan";
import {LoginPage} from "../login/login";
import {AboutPage} from "../about/about";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

   @ViewChild(Navbar) navBar: Navbar;
   constructor(
       public alertCtrl: AlertController,
       private storage: Storage,
       private callSvc: CallNumber,
       public navCtrl: NavController) {
   }

   startCall(){
       this.callSvc.callNumber("00491719760565",true).then(()=> {
           console.log('number dialed');
       }).catch((err)=>{
           alert(JSON.stringify(err))
       })
   }

   callInsurance () {
       const confirm = this.alertCtrl.create({
           title: '0123-456789',
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

