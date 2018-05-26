import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { RestProvider } from '../../providers/rest/rest';
import { SignupPage } from '../signup/signup';
import { AppComponent } from '../register/register';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    private image: string;
    private imgbase64: string;
    private newItem: string;

    users: any;

    constructor(
        public navCtrl: NavController,
        public toastCtrl: ToastController,
        public alertCtrl: AlertController,
        private domSanitizer: DomSanitizer,
        public restProvider: RestProvider) {
          this.getData();
        }

    goToSignup(params){
      if (!params) params = {};
      this.navCtrl.push(AppComponent);
    }goToCart(params){
      if (!params) params = {};
      this.navCtrl.push(LoginPage);
    }


    sentToast() {
        console.log(this.users.data[0].l_name);
        let toast = this.toastCtrl.create({
            message: "Name: " + this.users.data[0].v_name +" "+ this.users.data[0].l_name,
            duration: 3000,
            position: 'top'
        });


        this.newItem =  this.imgbase64;
        toast.present();
    }


    getData() {
      this.restProvider.getData()
        .then(data => {
          this.users = data;
          console.log(this.users);
        });
  }
}
