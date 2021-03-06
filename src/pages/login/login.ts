import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { RegistrationPage } from '../registration/registration';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Md5 } from "ts-md5";
import { HomePage } from "../home/home";
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

  /**
   * Information Message
   */
  private nachricht: String;
  /**
   * Check if the message will be shown
   * @type {boolean}
   */
  private submitAttempt: boolean = false;
  /**
   * Form group with email and password for validation
   */
  private myForm : FormGroup;

  /**
   * @constructor
   * @param {NavController} navCtrl Navigation Controller
   * @param {ToastController} toastCtrl Toast Message Controller
   * @param {RestProvider} restProvider Provider for Rest-Service
   * @param {Storage} storage Local Storage
   * @param {FormBuilder} formBuilder Form Builder
   * @param {Keyboard} keyboard Keyboard
   */
  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public restProvider: RestProvider,
              private storage: Storage,
              private formBuilder: FormBuilder,
              private keyboard: Keyboard) {

    //detect if keyboard is shown
    this.keyboard.onKeyboardShow().subscribe(() => {
      console.log("keyboard detected")
      this.keyboard.disableScroll(false);
    });

    //this.storage.clear();

    this.myForm = formBuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
      password : ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }

  /**
   * View an infomation message for 3 seconds  if the information button will be pressed
   * @param myParam Parameter which button will be pressed 1 or 2
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
          //console.log(result);

        if(restResult.data[0].mail == "true") {
            if(restResult.data[0].password == "true"){
                this.storage.set('identity',JSON.stringify({"userID":restResult.data[0].userID}));
                this.navCtrl.push(HomePage,{userID: restResult.data[0].userID});
            }else{
                this.sentToast("Das Passwort stimmt leider nicht. \nBitte versuchen Sie es erneut.", true, "3000", "x");
            }
        }else{
          this.sentToast("Die E-Mail stimmt leider nicht. \nBitte versuchen Sie es erneut.", true, "3000", "x");
        }
      }, (err) => {
        console.log('error2 ' + err.message);
        this.sentToast("Keine Internetverbindung vorhanden. \nBitte versuchen Sie es erneut.", true, "3000", "x");
        //this.navCtrl.push(LoginPage);
      });
    };
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
