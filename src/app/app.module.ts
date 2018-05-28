import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular-lite';
import { Camera } from '@ionic-native/camera';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { RegistrationPage } from '../pages/registration/registration';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from '../provider/rest/rest';
import { HttpClientModule } from '@angular/common/http';
import { RedditData } from '../provider/reddit-data/reddit-data';
//import { CameraMock } from './mocks/CameraMock';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    SignupPage,
    RegistrationPage

  ],
  imports: [
    FormsModule,
    MbscModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AboutPage,
    ContactPage,
    HomePage,
    SignupPage,
    RegistrationPage

  ],
  providers: [
    StatusBar,
    SplashScreen,
    [{ provide: ErrorHandler, useClass: IonicErrorHandler }],
    RestProvider,
    RedditData //if running on device
    //{ provide: Camera, useClass: CameraMock} //if running on browser
  ]
})
export class AppModule {}
