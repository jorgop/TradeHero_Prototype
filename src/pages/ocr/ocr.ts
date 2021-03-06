import { Component } from '@angular/core';
import {LoadingController, NavController, ToastController} from "ionic-angular";
import {NavParams} from "ionic-angular";
import { AlertController } from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RestProvider} from "../../providers/rest/rest";
import {Storage} from "@ionic/storage";
import {ActivityPage} from "../activity/activity";
import {HomePage} from "../home/home";
import {IbanValidator} from "../../validators/iban";
import {PlzValidator} from "../../validators/plz";
import {RefundValidator} from "../../validators/refund";

@Component({
    selector: 'page-ocr',
    templateUrl: 'ocr.html'
})
export class OcrPage {

  /**
   * Scanned image
   */
  private scanedImage : any;

  /**
   * Raw image for OCR
   */
  private rawImage : any;

  /**
   * Form for input vields
   */
  private myForm : FormGroup;

  /**
   * Form with validated fields
   */
  private myVal : any;

  /**
   * Loading animation for OCR request
   */
  private osrLoading : any;

  /**
   * Loadig animation while crating the activity
   */
  private sendLoading : any;

  /**
   * Current user-id
   */
  private userID : any;

  /**
   * Constructor ocrPage
   * @constructor
   * @param {NavController} navCtrl
   * @param {NavParams} navParams
   * @param {AlertController} alertCtrl
   * @param {FormBuilder} formBuilder
   * @param {LoadingController} loadingController
   * @param {RestProvider} restProvider
   * @param {ToastController} toastCtrl
   * @param {Storage} storage
   */
    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private alertCtrl: AlertController,
                private formBuilder: FormBuilder,
                public loadingController: LoadingController,
                public restProvider: RestProvider,
                public toastCtrl: ToastController,
                private storage: Storage) {

      //get userID from local storage
      this.storage.get('identity').then((val) => {
        let identity = <any>{};
        identity = JSON.parse(val);
        this.userID = identity['userID'];
      });

      //get images by parameter injection from the preview page
      this.scanedImage = this.navParams.get('scanedImage');
      this.rawImage = this.navParams.get('rawImage');

      //field validation structure
      this.myVal = {
        name: "true",
        street: "true",
        place : "true",
        plz : "true",
        BIC : "true",
        IBAN : "true",
        invoiceNumber : "true",
        refund : "true"
      }

      //form for ocr text and validation
      this.myForm = formBuilder.group({
        name: ['', Validators.required],
        street: ['', Validators.required],
        place : ['', Validators.required],
        plz : ['', Validators.compose([Validators.required, PlzValidator.isValid])],
        BIC : ['', Validators.required],
        IBAN : ['', Validators.compose([Validators.required, IbanValidator.isValid])],
        invoiceNumber : [''],
        refund : ['', Validators.compose([Validators.required, RefundValidator.isValid])],
      });

      //loading for ocr request
      this.osrLoading = this.loadingController.create({
        content: 'Text wird erkannt...'
      });

      //loading for sending data
      this.sendLoading = this.loadingController.create({
        content: 'Rechnung wird eingereicht...'
      });
    }

  /**
   * IF the page will be entered the image will be send to the server for OCR
   */
  ionViewWillEnter(){
    this.callOcrRequest();
  }

  /**
   * Send scanned file to the server and get the text from ocr
   */
  callOcrRequest(){

    //view loading animation
    this.osrLoading.present();

    //json structure for ocr data call
    let myScanedImage = {"imgFile": this.rawImage};

    this.restProvider.getOcrData(myScanedImage).then((result) => {

      let ocrDataFile = <any>{};
      ocrDataFile = result;

      let docData = <any>{};
      docData = result['Doc'];

      //update the input fields with the detected text from the ocr request
      Object.keys(docData).forEach(key => {
        switch(key){
          case "Name":{
            this.myForm.patchValue({name:docData[key]});
            break;
          }
          case "Street":{
            this.myForm.patchValue({street:docData[key]});
            break;
          }
          case "City":{
            this.myForm.patchValue({place:docData[key]});
            break;
          }
          case "plz":{
            this.myForm.patchValue({plz:docData[key]});
            break;
          }
          case "BIC":{
            this.myForm.patchValue({BIC:docData[key]});
            break;
          }
          case "IBAN":{
            this.myForm.patchValue({IBAN:docData[key]});
            break;
          }
          case "invoiceNumber":{
            this.myForm.patchValue({invoiceNumber:docData[key]});
            break;
          }
          case "refund":{
            this.myForm.patchValue({refund:docData[key]});
            break;
          }
        };
      });

      //remove , and € from amount
      let refund = ocrDataFile['Amount'];
      refund = refund.replace(',','.');
      refund = refund.substring(0, refund.length - 1);

      //set amount
      this.myForm.patchValue({refund:refund});

      //call field validation
      this.validateFields();

      //hide loading animation
      this.osrLoading.dismiss().then(() => {
        console.log('OCR Success');
      });
    }, (err) => {
      console.log('OCR failed ' + err);
      this.osrLoading.dismiss().then(() => {
        console.log('Oooops OCR failed');
        this.validateFields();
        this.sentToast("Der Text konnte nicht erkannt werden.",false,3000,"schließen");
      });
    });
  }

  /**
   * Validate fields and mark incorrect fields with a red border
   */
  validateFields(){

    if(!this.myForm.controls.name.valid){
      this.myVal.name = "false";
    }else{
      this.myVal.name = "true";
    }

    if(!this.myForm.controls.street.valid){
      this.myVal.street = "false";
    }else{
      this.myVal.street = "true";
    }

    if(!this.myForm.controls.place.valid){
        this.myVal.place = "false";
    }else{
        this.myVal.place = "true";
    }

    if(!this.myForm.controls.plz.valid){
        this.myVal.plz = "false";
    }else{
        this.myVal.plz = "true";
    }

    if(!this.myForm.controls.BIC.valid){
        this.myVal.BIC = "false";
    }else{
        this.myVal.BIC = "true";
    }

    if(!this.myForm.controls.IBAN.valid){
      this.myVal.IBAN = "false";
    }else{
      this.myVal.IBAN = "true";
    }

    if(!this.myForm.controls.invoiceNumber.valid){
      this.myVal.invoiceNumber = "false";
    }else{
      this.myVal.invoiceNumber = "true";
    }

    if(!this.myForm.controls.refund.valid){
      this.myVal.refund = "false";
    }else{
      this.myVal.refund = "true";
    }
  }

  /**
   * Send formula data to the server and create a actvity
   */
  sendDataAndCreateActivity(){

    //validate fields
    this.validateFields();

    if( this.myForm.controls.name.valid &&
        this.myForm.controls.street.valid &&
        this.myForm.controls.place.valid  &&
        this.myForm.controls.plz.valid  &&
        this.myForm.controls.BIC.valid &&
        this.myForm.controls.IBAN.valid &&
        this.myForm.controls.refund.valid){

      this.sendLoading.present();

      var restData = <any>{};

      restData = { "activity":[
          { "userID": this.userID ,
            "imgFile": this.scanedImage,
            "name": this.myForm.controls.name.value,
            "street": this.myForm.controls.street.value,
            "place" : this.myForm.controls.place.value,
            "plz" : this.myForm.controls.plz.value,
            "BIC" :  this.myForm.controls.BIC.value,
            "IBAN" :  this.myForm.controls.IBAN.value,
            "invoiceNumber" :  this.myForm.controls.invoiceNumber.value,
            "refund" :  this.myForm.controls.refund.value
          }
        ]
      };

      console.log(restData);

      //call rest service to crate activity
      this.restProvider.addActivity(restData).then((result) => {
        if (result == true){
          this.sendLoading.dismiss().then(() => {
            console.log("Activity erfolgreich erstellt.");
            this.navCtrl.push(ActivityPage);
          });
        }else {
          this.sentToast("Die Rechnung konnte nicht eingereicht \nwerden.",false,3000,"schließen");
        }
      }, (err) => {
        this.sendLoading.dismiss();
        console.log('error2 ' + err);
        this.sentToast("Keine Internetverbindung vorhanden. \nBitte versuchen Sie es erneut.",false,3000,"schließen");
      });
    }else{

      //wrong fields for toast message
      var wrongTextFields = "";
      var checkValuesList = { "name":this.myForm.controls.name.valid,
                              "street":this.myForm.controls.street.valid ,
                              "place":this.myForm.controls.place.valid  ,
                              "plz":this.myForm.controls.plz.valid  ,
                              "BIC":this.myForm.controls.BIC.valid ,
                              "IBAN":this.myForm.controls.IBAN.valid ,
                              "refund":this.myForm.controls.refund.valid };

      //push wrong values to the checkValuesList
      for(let key in checkValuesList){
        if(checkValuesList[key] == false){

          switch (key){
            case "name": {
              wrongTextFields += "Arzt" + "\n";
              break;
            }
            case "street":{
              wrongTextFields += "Straße" + "\n";
              break;
            }
            case "place":{
              wrongTextFields += "Ort" + "\n";
              break;
            }
            case "plz":{
              wrongTextFields += "Postleitzahl" + "\n";
              break;
            }
            case "BIC":{
              wrongTextFields += "BIC" + "\n";
              break;
            }
            case "IBAN":{
              wrongTextFields += "IBAN" + "\n";
              break;
            }
            case "refund":{
              wrongTextFields += "Rechnungsbetrag" + "\n";
              break;
            }
          }
        }
      };
      this.sentToast("Bitte überprüfen Sie die folgenden Felder: \n"+ wrongTextFields, true,5000,"x");
    }
  }

  /**
   * Present confirmation box
   */
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Korrektheit der Daten',
      message: 'Ich bestätige, dass meine Angaben korrekt sind und der Rechnungsbetrag von '+ this.myForm.controls.refund.value +' € mit der eingereichten Rechnung übereinstimmt.',
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
   * @param message Toast message
   * @param showCloseButton Show close button
   * @param duration Duration of toast message
   * @param closeButtonText Text of the close button
   */
  sentToast(message,showCloseButton,duration,closeButtonText) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'top',
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText

    });
    toast.present();
  }
}
