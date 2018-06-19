import { Component } from '@angular/core';
import {LoadingController, NavController, ToastController} from "ionic-angular";
import {NavParams} from "ionic-angular";
import { AlertController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestProvider} from "../../providers/rest/rest";
import {Storage} from "@ionic/storage";
import {ActivityPage} from "../activity/activity";
import {HomePage} from "../home/home";

@Component({
    selector: 'page-ocr',
    templateUrl: 'ocr.html'
})
export class OcrPage {

    private scanedImage : any;
    private myForm : FormGroup;
    private osrLoading : any;
    private sendLoading : any;
    private userID : any;

    constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private formBuilder: FormBuilder, public loadingController: LoadingController,public restProvider: RestProvider,public toastCtrl: ToastController,private storage: Storage) {

      this.storage.get('identity').then((val) => {
        let identity = <any>{};
        identity = JSON.parse(val);
        this.userID = identity['userID'];
      });


      this.scanedImage = this.navParams.get('scanedImage');

      //form for ocr text
      this.myForm = formBuilder.group({
        name: ['', Validators.required],
        street: [''],
        place : [''],
        plz : [''],
        bankName : [''],
        IBAN : [''],
        invoiceNumber : [''],
        refund : [''],
      });

      //loading for ocr request
      this.osrLoading = this.loadingController.create({
        content: 'Text wird erkannt'
      });

      //loading for sending data
      this.sendLoading = this.loadingController.create({
        content: 'Rechung wird eingereicht'
      });
    }


  ionViewWillEnter(){
    this.callOcrRequest();
  }

  /**
   * Send scaned file to the server and get the text from ocr
   */
  callOcrRequest(){

    this.osrLoading.present();

    let myScanedImage = this.scanedImage;

    this.restProvider.getOcrData(myScanedImage).then((result) => {

      let ocrDataFile = <any>{};
      ocrDataFile = result;
      ocrDataFile = ocrDataFile['data'][0];

      //get values from a current activity
      Object.keys(ocrDataFile).forEach(key => {
        console.log(key);

        switch(key){
          case "name":{
            this.myForm.patchValue({name:ocrDataFile[key]});
            break;
          }
          case "street":{
            this.myForm.patchValue({street:ocrDataFile[key]});
            break;
          }
          case "place":{
            this.myForm.patchValue({place:ocrDataFile[key]});
            break;
          }
          case "plz":{
            this.myForm.patchValue({plz:ocrDataFile[key]});
            break;
          }
          case "bankName":{
            this.myForm.patchValue({bankName:ocrDataFile[key]});
            break;
          }
          case "IBAN":{
            this.myForm.patchValue({IBAN:ocrDataFile[key]});
            break;
          }
          case "invoiceNumber":{
            this.myForm.patchValue({invoiceNumber:ocrDataFile[key]});
            break;
          }
          case "refund":{
            this.myForm.patchValue({refund:ocrDataFile[key]});
            break;
          }
        };
      });

      this.osrLoading.dismiss().then(() => {
        console.log('OCR Success');
      });
    }, (err) => {
      console.log('OCR failed ' + err);
      this.osrLoading.dismiss().then(() => {
        console.log('Oooops OCR failed');
        this.sentToast("Scan failed");
      });
      //this.navCtrl.push(LoginPage);
    });
  }


  /**
   * Send formula data to the server and create a actvity
   */
  sendDataAndCreateActivity(){

    this.sendLoading.present();

    var restData = <any>{};

    restData = { "activity":[
        { "userID": this.userID ,
          "imgFile": this.scanedImage,
          "name": this.myForm.controls.name.value,
          "street": this.myForm.controls.street.value,
          "place" : this.myForm.controls.place.value,
          "plz" : this.myForm.controls.plz.value,
          "bankName" :  this.myForm.controls.bankName.value,
          "IBAN" :  this.myForm.controls.IBAN.value,
          "invoiceNumber" :  this.myForm.controls.invoiceNumber.value,
          "refund" :  this.myForm.controls.refund.value
        }
      ]
    };

    this.restProvider.addActivity(restData).then((result) => {
      if (result == true){
        this.sendLoading.dismiss().then(() => {
          console.log("Activity erfolgreich erstellt");
          this.navCtrl.push(ActivityPage);
        });
      }else {
        this.sentToast("Activity konnte nicht erstellt werden")
      }
    }, (err) => {
      this.sendLoading.dismiss();
      console.log('error2 ' + err);
      this.sentToast("Oooops activity failed");
    });
  }

  /**
   * Present confirmation box
   */
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Korrektheit der Daten',
      message: 'Ich bestätige, dass meine Angaben korrekt sind, der Rechungsbetrag von '+ this.myForm.controls.refund.value +' € und stimmt mit der Rechnung überein.',
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
            console.log('Send clicked');
            this.sendDataAndCreateActivity();
          }
        }
      ]
    });
    alert.present();
  }


  /**
   * Navigation to HomePage
   */
  goToHome(){
    this.navCtrl.push(HomePage);
  }

  /**
   * View a toast message
   * @param message Toast Text
   */
  sentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
