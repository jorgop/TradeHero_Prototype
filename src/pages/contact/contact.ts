import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CallNumber} from "@ionic-native/call-number";
import {e} from "@angular/core/src/render3";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  constructor(
      public navCtrl: NavController,
      private callSvc: CallNumber) {
        }

    /*callInsurance(){
        this.callSvc.callNumber("00491719760565",true).then(()=> {
          console.log('number dialed');
        }).catch((err)=>{
          alert(JSON.stringify(err))
        })
  }*/
   async callInsurance():Promise<any>{
      try{
      await this.callSvc.callNumber("00491719760565",true).then(()=> {
          console.log('number dialed');
      }).catch((err)=>{
          alert(JSON.stringify(err))
      })}finally {

      }
   }
}

