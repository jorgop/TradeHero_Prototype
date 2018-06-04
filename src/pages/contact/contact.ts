import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {CallNumber} from "@ionic-native/call-number";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
})
export class ContactPage {

  constructor(
      public navCtrl: NavController,
      private callNumber: CallNumber) {
  }

    callInsurance(){
        this.callNumber.callNumber("01727709196", true)
            .then(res => console.log('Launched dialer!', res))
            .catch(err => console.log('Error launching dialer', err));
    }
}
