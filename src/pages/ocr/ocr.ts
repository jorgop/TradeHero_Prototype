import { Component } from '@angular/core';
import {NavController} from "ionic-angular";
import {NavParams} from "ionic-angular";
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-ocr',
    templateUrl: 'ocr.html'
})
export class OcrPage {

    scanedImage : any;
    name : string = "Dr. Mega Super";
    street : string = "Neugasse 45";
    place : string = "Frankfurt";
    plz : string = "12345";


    bankName : string = "DEUTSCHE KREDITBANK BERLIN";
    IBAN : string = "DE02120300000000202051";

    invoiceNumber : string = "R122000";
    cash : string = "450,68";


    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private alertCtrl: AlertController) {

        this.scanedImage = this.navParams.get('scanedImage');
    }


  ionViewWillEnter(){

  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Korrektheit der Daten',
      message: 'Ich bestätige, dass meine Angaben korrekt sind, der Rechungsbetrag von 450,68 € und stimmt mit der Rechnung überein.',
      buttons: [
        {
          text: 'Nein',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Abschicken',
          handler: () => {
            console.log('Buy clicked');
          }
        }
      ]
    });
    alert.present();
  }

}
