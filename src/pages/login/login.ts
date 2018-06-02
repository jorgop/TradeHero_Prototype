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
          this.navCtrl.push(HomePage);
        }else{
          this.sentToast("Wrong password!");

          // Test data for local storage
          let myJsonTOStore = {"activityList": [
              {
                "ticketID": 1001,
                "userID": 1,
                "IBAN": "DE123123123123123123123",
                "dateCreate": "2018-06-02",
                "street": "Am Arzt Weg",
                "houseNumber": "34",
                "PLZ": "12345",
                "place": "Frankfurt",
                "accountName": "Praxis Super",
                "bankName": "Deutsche Bank",
                "refund": 450.23,
                "imgFile": "0x2334",
                "status": 0,
                "history": [
                  {
                    "ticketID": 1001,
                    "stateID": 1,
                    "sateDate": "2018-06-01",
                    "stateText": "Rechung wird gepüft",
                    "status": "1"
                  },
                  {
                    "ticketID": 1001,
                    "stateID": 2,
                    "sateDate": "2018-06-01",
                    "stateText": "Rechung wird bearbeitet",
                    "status": "1"
                  },
                  {
                    "ticketID": 1001,
                    "stateID": 3,
                    "sateDate": "2018-06-02",
                    "stateText": "Rechung wird überwiesen",
                    "status": "0"
                  }
                ]
              },
              {
                "ticketID": 1002,
                "userID": 1,
                "IBAN": "DE123123122342342355",
                "dateCreate": "2018-06-02",
                "street": "Am Graben",
                "houseNumber": "322",
                "PLZ": "12345",
                "place": "Frankfurt",
                "accountName": "Praxis Schlecht",
                "bankName": "Frnakfurter Volksbank",
                "refund": 50.23,
                "imgFile": "0x2334",
                "status": 0,
                "history": [
                  {
                    "ticketID": 1002,
                    "stateID": 1,
                    "sateDate": "2018-06-01",
                    "stateText": "Rechung wird gepüft",
                    "status": "1"
                  },
                  {
                    "ticketID": 1002,
                    "stateID": 2,
                    "sateDate": "2018-06-01",
                    "stateText": "Rechung wird bearbeitet",
                    "status": "0"
                  }
                ]
              }
            ]};

          console.log(myJsonTOStore);
          this.storage.set('login', JSON.stringify(myJsonTOStore));
          this.storage.get('login').then((val) => {



            //let result = JSON.parse(val);
          });
        }
      }, (err) => {
        console.log('error2 ' + err.message);
        this.sentToast("Oooops registration failed");
        //this.navCtrl.push(LoginPage);
      });
    }
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

