import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { RestProvider } from '../../providers/rest/rest';
import { RegistrationPage } from '../registration/registration';
import { FormBuilder, FormGroup } from "@angular/forms";
import { Md5 } from "ts-md5";
import { HomePage } from "../home/home";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    users: any;

    constructor(
        public fb: FormBuilder,
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public restProvider: RestProvider) {
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

    formSettings = {
      lang: 'de',
      theme: 'ios'
    };

    // Reactive Form

    reactForm: FormGroup;
    reactSubmitted: boolean = false;

    getErrorState(field: string) {
      var ctrl = this.reactForm.get(field);
      return ctrl.invalid && this.reactSubmitted;
    }

    //unused ?
    registerReact() {
      this.reactSubmitted = true;
      if (this.reactForm.valid && this.thanksPopup) {
        this.thanksPopup.instance.show();
      }
    };


    // Template Driven Form

    @ViewChild('templForm')
    templForm: any;
    templSubmitted: boolean = false;
    gender: string = '';
    //key = new Uint8Array([1, 2, 3, 4]);
    restResponse: any;

  /**
   * Check validation
   */
  registerTempl() {
      this.templSubmitted = true;

      if (this.templForm && this.templForm.valid) {

        //password md5 encryption
        Md5.hashStr(this.templForm.value.password);

        this.restProvider.checkLogin(this.templForm.value.email,Md5.hashStr(this.templForm.value.password)).then((result) => {
          //convert result to type
          let restResult = <any>{};
          restResult = result;

          if(restResult.data[0].login == "true"){
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
    };

    getErrorMessage(field: string, form: string) {
      var formCtrl = form === 'react' ? this.reactForm : this.templForm.control,
        message = '';
      if (formCtrl) {
        var ctrl = formCtrl.get(field);
        if (ctrl && ctrl.errors) {
          for (var err in ctrl.errors) {
            if (!message && ctrl.errors[err]) {
              message = this.errorMessages[field][err];
            }
          }
        }
      }
      return message;
    }

    errorMessages = {
      email: {
        required: 'Email address required',
        email: 'Invalid email address'
      },
      password: {
        required: 'Password required',
        minlength: 'At least 6 characters required'
      }
    }

    @ViewChild('thanks')
    thanksPopup: any;

    widgetSettings: any = {
      theme: 'ios',
      display: 'center',
      focusOnClose: false,
      buttons: [{
        text: 'Log in',
        handler: 'set'
      }]
    };


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

