import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { RegistrationPage } from '../registration/registration';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Md5 } from "ts-md5";
import { HomePage } from "../home/home";
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

  nachricht: String;
  nachrichtzwei: String;

  submitAttempt: boolean = false;
  private myForm : FormGroup;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public restProvider: RestProvider,
              private storage: Storage,
              private formBuilder: FormBuilder) {

    //this.storage.clear();

    this.myForm = formBuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
      password : ['', Validators.compose([Validators.minLength(6), Validators.required])],
    });
  }

  message () {
    this.nachricht = "Max@Mustermann.de";
    return this.nachricht;
  }

    messagetwo () {
        this.nachrichtzwei = "Mindestens 6 Buchstaben";
        return this.nachrichtzwei;
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
        if(restResult.data[0].login == "true"){

          this.storage.set('identity',JSON.stringify({"userID":restResult.data[0].userID}));
          this.navCtrl.push(HomePage,{userID: restResult.data[0].userID});
        }else{
          this.sentToast("Die Anmeldung ist leider fehlgeschlagen. Bitte versuchen Sie es erneut.");
        }
      }, (err) => {
        console.log('error2 ' + err.message);
        this.sentToast("Oooops registration failed");
        //this.navCtrl.push(LoginPage);
      });
    };
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

