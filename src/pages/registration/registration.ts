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

    nachricht: String;
    nachrichtzwei: String;
    nachrichtdrei: String;

  submitAttempt: boolean = false;
  private myForm : FormGroup;

  constructor(public navCtrl: NavController, public restProvider: RestProvider, public toastCtrl: ToastController, private formBuilder: FormBuilder) {
    this.myForm = formBuilder.group({
      email: ['',Validators.compose([Validators.required, Validators.email])],
      token: ['', Validators.compose([Validators.minLength(6), Validators.required])],
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

  messagethree () {
    this.nachrichtdrei = "Mindestens 6 Buchstaben";
    return this.nachrichtdrei;
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
            this.sentToast("Email nicht registriert!");
        }else if (registration["token"]== "false"){
            this.sentToast("Bitte Token prüfen!");
        }else if (registration["activate"] == "false"){
            this.sentToast("Konto bereits aktiviert!");
            this.navCtrl.push(LoginPage);
        }else{
            this.sentToast("Konto erfolgreich aktiviert!");
            this.navCtrl.push(LoginPage);
        }
      }, (err) => {
        console.log('error2 ' + err);
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
