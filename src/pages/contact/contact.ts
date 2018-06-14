import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CallNumber} from "@ionic-native/call-number";
import {AlertController} from 'ionic-angular';
import {e} from "@angular/core/src/render3";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  /* constructor(
      public navCtrl: NavController,
      private callSvc: CallNumber) {
        }

    callInsurance(){
        this.callSvc.callNumber("00491719760565",true).then(()=> {
          console.log('number dialed');
        }).catch((err)=>{
          alert(JSON.stringify(err))
        })
  } */ /*
   async callInsurance():Promise<any>{
      try{
      await this.callSvc.callNumber("00491719760565",true).then(()=> {
          console.log('number dialed');
      }).catch((err)=>{
          alert(JSON.stringify(err))
      })}finally {

      }
   } */

   constructor(public alertCtrl: AlertController) {}

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
                   }
               }
           ]
       });
       confirm.present();
   }
}

