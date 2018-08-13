import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import {Md5} from "ts-md5";


@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html'

})
export class RegistrationPage {

  /**
   *  Information Message
   */
  private nachricht: String;
  /**
   * Check if the message will be shown
   * @type {boolean}
   */
  private submitAttempt: boolean = false;
  /**
   * Form group with the elements email, token and the hashed password for the authentication
   */
  private myForm : FormGroup;

  /**
   * @constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {RestProvider} restProvider Provider for Rest-Service
   * @param {ToastController} toastCtrl Toast Message Controller
   * @param {FormBuilder} formBuilder Form Builder
   */
  constructor(public navCtrl: NavController,
              public restProvider: RestProvider,
              public toastCtrl: ToastController,
              private formBuilder: FormBuilder) {

    this.myForm = formBuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
      token: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      password : ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }

  /**
   * View an infomation message for 3 seconds  if the information button will be pressed
   * @param myParam Parameter which button will be pressed 1,2 or 3
   */
  message(myParam) {

        if (myParam == 1) {
            this.nachricht = "Max@Mustermann.de";
            const start = Date.now();
            let timeOutHandler = setTimeout(
                () => {
                    const e = Date.now() - start;
                    this.nachricht = "";
                },
                3000
            );
        };

        if(myParam == 2) {
            this.nachricht = "Mindestens 6 Buchstaben";
            const start = Date.now();
            let timeOutHandler = setTimeout(
                () => {
                    const e = Date.now() - start;
                    this.nachricht = "";
                },
                3000
            );
        };

        if(myParam == 3) {
            this.nachricht = "Mindestens 6 Buchstaben";
            const start = Date.now();
            let timeOutHandler = setTimeout(
                () => {
                    const e = Date.now() - start;
                    this.nachricht = "";
                },
                3000
            );
        };
    }


  /**
   *  Page routing
   * @param params Routing parameter
   */
  goToLogin(params){
    if (!params) params = {};
    this.navCtrl.push(LoginPage);
  }


  /**
   * Activate the user
   */
  activateUser(){
    this.submitAttempt = true;

    if(!this.myForm.valid){
     console.log(this.myForm);
    }
    else {
      var restData =
        { "user":
          [
            {"mailAddress":this.myForm.controls.email.value},
            {"token":this.myForm.controls.token.value},
            {"password":Md5.hashStr(this.myForm.controls.password.value)}
          ]
        };

      this.restProvider.addUser(restData).then((result) => {

        let registration = <any>{};
        registration = result;
        registration = registration.registration[0];

        if (registration["mail"] == "false"){
            this.sentToast("E-Mail nicht registriert!", true, "3000", "x");
        }else if (registration["token"]== "false"){
            this.sentToast("Bitte Token überprüfen!", true, "3000", "x");
        }else if (registration["activate"] == "false"){
            this.sentToast("Konto ist bereits aktiviert!", true, "3000", "x");
            this.navCtrl.push(LoginPage);
        }else{
            this.sentToast("Konto wurde erfolgreich aktiviert!", true, "3000", "x");
            this.navCtrl.push(LoginPage);
        }
      }, (err) => {
        console.log('error2 ' + err);
        this.sentToast("Keine Internetverbindung.", true, "3000", "x");
        //this.navCtrl.push(LoginPage);
      });
    }
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
