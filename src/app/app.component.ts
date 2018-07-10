import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from "../pages/login/login";
import {HomePage} from "../pages/home/home";
import {RegistrationPage} from "../pages/registration/registration";
import {ContactPage} from "../pages/contact/contact";
import {ActivityPage} from "../pages/activity/activity";
import {ImpressumPage} from "../pages/impressum/impressum";
import {OcrPage} from "../pages/ocr/ocr";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = OcrPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
