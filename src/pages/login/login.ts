import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { RegistrationPage } from '../registration/registration';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Md5 } from "ts-md5";
import { HomePage } from "../home/home";
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

  submitAttempt: boolean = false;
  private myForm : FormGroup;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public restProvider: RestProvider, private storage: Storage,private formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
      password : ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }

    /**
    * Site navigation
    * @param params
    */
    goToSignup(params){
      if (!params) params = {};
      this.navCtrl.push(RegistrationPage);
    }goToLogin(params){
      if (!params) params = {};
      this.navCtrl.push(LoginPage);
    }


  /**
   * Authentication for login
   */
  authenticateUser(){
    this.submitAttempt = true;

    if(!this.myForm.valid){
      console.log(this.myForm);
    }
    else {

      this.restProvider.checkLogin(this.myForm.controls.email.value,Md5.hashStr(this.myForm.controls.password.value)).then((result) => {
        //convert result to type
        let restResult = <any>{};
        restResult = result;

        if(restResult.data[0].login == "true"){
          this.addDummyDataToLS()
          this.navCtrl.push(HomePage);
        }else{
          this.sentToast("Wrong password!");
        }
      }, (err) => {
        console.log('error2 ' + err.message);
        this.sentToast("Oooops registration failed");
        //this.navCtrl.push(LoginPage);
      });
    }
  }

  /**
   * Dummy data - will be replaced by rest call soon
   */
  addDummyDataToLS(){
    this.storage.set('user', JSON.stringify({
        "userData": [
            {
                "gender": "m",
                "firstName": "Max",
                "lastName": "Mustermann",
                "birthdate": "1990-01-01",
                "mail": "test@test.de",
                "street": "Musterweg ",
                "houseNumber": "12",
                "place": "Frankfurt",
                "PLZ": "12345",
                "contractID": "V123PL29",
                "contractName": "AOK Privat PLUS"
            }
        ]
    }));
    this.storage.set('strActivities',JSON.stringify({
      "acticityList": [
        {
          "ticketID": 1001,
          "userID": 1,
          "IBAN": "DE123123123123123123123",
          "createDate": "2018-06-02",
          "street": "Am Arzt Weg",
          "houseNumber": "34",
          "PLZ": "12345",
          "place": "Frankfurt",
          "invoiceID":"VD123GHUZ8",
          "accountName": "Praxis Super",
          "bankName": "Deutsche Bank",
          "refund": 450.23,
          "imgFile": "0x2334",
          "ticketStatus": 0,
          "history": [
            {
              "ticketID": 1001,
              "stateID": 1,
              "sateDate": "2018-06-01",
              "stateText": "Rechung wird gepüft",
              "stateStatus": "1"
            },
            {
              "ticketID": 1001,
              "stateID": 2,
              "sateDate": "2018-06-01",
              "stateText": "Rechung wird bearbeitet",
              "stateStatus": "1"
            },
            {
              "ticketID": 1001,
              "stateID": 3,
              "sateDate": "2018-06-02",
              "stateText": "Rechung wird überwiesen",
              "stateStatus": "0"
            }
          ]
        },
        {
          "ticketID": 1002,
          "userID": 1,
          "IBAN": "DE123123122342342355",
          "createDate": "2018-06-02",
          "street": "Am Graben",
          "houseNumber": "322",
          "PLZ": "12345",
          "place": "Frankfurt",
          "invoiceID":"VD123GHUZ8",
          "accountName": "Praxis Schlecht",
          "bankName": "Frnakfurter Volksbank",
          "refund": 50.23,
          "imgFile": "0x2334",
          "ticketStatus": 0,
          "history": [
            {
              "ticketID": 1002,
              "stateID": 1,
              "sateDate": "2018-06-01",
              "stateText": "Rechung wird gepüft",
              "stateStatus": "1"
            },
            {
              "ticketID": 1002,
              "stateID": 2,
              "sateDate": "2018-06-01",
              "stateText": "Rechung wird bearbeitet",
              "stateStatus": "0"
            }
          ]
        }
      ]
    }));
      this.storage.get('strActivities').then((val) => {
          //console.log('My JSON',JSON.parse(val) );
      });
      this.storage.get('user').then((val) => {
        //Magie: erzeugt variable myLocalData als liste um danach die json daten als liste zu speichern
        let myLocalData = <any>{};
          myLocalData = JSON.parse(val);
          //console.log(myLocalData.userData[0].firstName,myLocalData.userData[0].lastName);
      });
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

