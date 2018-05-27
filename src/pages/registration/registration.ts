import { Component, ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { RestProvider } from '../../providers/rest/rest';
import { RedditData } from '../../providers/reddit-data/reddit-data';
import { Md5 } from 'ts-md5/dist/md5';


@Component({
  selector: 'demo-app',
  templateUrl: './registration.html'
})
export class RegistrationPage{
  // Place the code below into your own component or use the full template
  response: any;
//  countries: any;
//  errorMessage: string;
  users: any;

  constructor(public fb: FormBuilder,public toastCtrl: ToastController,public restProvider: RestProvider,public navCtrl: NavController,public rest: RedditData) {
    this.reactForm = fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

/**
  ionViewDidLoad() {
    this.getCountries();
  }

  getCountries() {
    this.rest.getCountries()
      .subscribe(
        countries => this.countries = countries,
        error =>  this.errorMessage = <any>error);
  }

  saveUser(myd) {
    this.rest.addUser(myd).then((result) => {
      console.log(result);
    }, (err) => {
      console.log(err);
    });
  }
**/

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

  registerTempl() {
    this.templSubmitted = true;

    if (this.templForm && this.templForm.valid) {

      //password md5 encryption
      Md5.hashStr(this.templForm.value.password);
      console.log(Md5.hashStr(this.templForm.value.password));

      var restData = {"user": [{"lastName": this.templForm.value.lastname}, {"firstName": this.templForm.value.firstname}, {"birthday": ''}, {"mailAddress": this.templForm.value.email}, {"password": Md5.hashStr(this.templForm.value.password)}]};

      this.restProvider.addUser(restData).then((result) => {
        this.sentToast("Thank you for registering.\n You have successfully signed up as a user! ");
        this.navCtrl.push(LoginPage);
        console.log(result);
      }, (err) => {
        console.log('error2 ' + err);
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
    firstname: {
      required: 'Firstname required',
      minlength: 'Has to be at least 3 characters'
    },
    lastname: {
      required: 'Lastname required',
      minlength: 'Has to be at least 3 characters'
    },
    gender: {
      required: 'Gender required'
    },
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
