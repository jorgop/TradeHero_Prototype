import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RestProvider } from '../../providers/rest/rest';
import { ToastController } from 'ionic-angular';
import { Validators } from '@angular/forms';
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'

})
export class SignupPage {
  signup = {
    firstname: ['', [Validators.required, Validators.minLength(2)]],
    lastname: '',
    birthday: '',
    email: '',
    password: ''
  };

  constructor(
    public navCtrl: NavController,
    public restProvider: RestProvider,
    public toastCtrl: ToastController) {
  }

  goToLogin(params){
    if (!params) params = {};
    this.navCtrl.push(LoginPage);
  }goToSignup(params){
    if (!params) params = {};
    this.navCtrl.push(SignupPage);
  }

  callSignup(){
    var url = "https://rest-app.brandau.solutions/api/register";
    var myData = { "user": [{"lastName": this.signup.lastname},{"firstName":this.signup.firstname},{"birthday":this.signup.birthday},{"mailAddress":this.signup.email},{"password":this.signup.password}]};
    //this.restProvider.submit(url,myData);
    this.sentToast("sign up successful");
    this.navCtrl.push(LoginPage);
  }

  sentToast(message) {

    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}

